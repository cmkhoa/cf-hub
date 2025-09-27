const express = require('express');
const { google } = require('googleapis');
const admin = require('../firebaseAdmin');
const authMiddleware = require('../middleware/auth');

// Router for /api/google-oauth
// Supports two modes:
// 1. GET /api/google-oauth -> starts OAuth flow (requires user JWT for association)
// 2. GET /api/google-oauth/callback?code=... -> completes flow, stores tokens in Firestore under users/{uid}/integrations/google

const router = express.Router();

// Scope: read-only Drive access for importing docs as blog content
const DRIVE_SCOPES = ['https://www.googleapis.com/auth/drive.readonly'];

function buildOAuthClient() {
  const { GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, GOOGLE_OAUTH_REDIRECT_URL } = process.env;
  if (!GOOGLE_OAUTH_CLIENT_ID || !GOOGLE_OAUTH_CLIENT_SECRET || !GOOGLE_OAUTH_REDIRECT_URL) {
    throw new Error('Missing Google OAuth environment variables');
  }
  return new google.auth.OAuth2(GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, GOOGLE_OAUTH_REDIRECT_URL);
}

// Start OAuth: redirect user to Google's consent screen.
router.get('/', authMiddleware, async (req, res) => {
  try {
    const oauth2Client = buildOAuthClient();
    // state can contain Firebase user id to validate after redirect
    const state = encodeURIComponent(JSON.stringify({ uid: req.user.id }));
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline', // ensures refresh token (first consent)
      scope: DRIVE_SCOPES,
      include_granted_scopes: true,
      prompt: 'consent',
      state
    });
    return res.redirect(authUrl);
  } catch (err) {
    console.error('OAuth start error:', err);
    return res.status(500).json({ message: 'Failed to start Google OAuth' });
  }
});

// Callback endpoint – not authenticated via JWT because user returns from Google.
router.get('/callback', async (req, res) => {
  try {
    const { code, state, error } = req.query;
    if (error) return res.status(400).send(`OAuth error: ${error}`);
    if (!code) return res.status(400).send('Missing code');
    let parsedState = null;
    try { parsedState = JSON.parse(decodeURIComponent(state || '')); } catch(e) {}
    if (!parsedState || !parsedState.uid) return res.status(400).send('Invalid state');

    const oauth2Client = buildOAuthClient();
    const { tokens } = await oauth2Client.getToken(code);
    // tokens: { access_token, refresh_token, scope, expiry_date, token_type }
    const uid = parsedState.uid;
    if (!admin.apps.length) {
      console.warn('Firebase admin not initialized; cannot store tokens');
      return res.status(500).send('Server misconfiguration');
    }
    const db = admin.firestore();
    await db.collection('userIntegrations').doc(uid).set({
      google: {
        tokens: {
          access_token: tokens.access_token,
            // Only store refresh token if returned (first consent or forced prompt=consent)
          refresh_token: tokens.refresh_token || null,
          scope: tokens.scope,
          expiry_date: tokens.expiry_date,
          token_type: tokens.token_type,
          obtained_at: Date.now()
        }
      }
    }, { merge: true });

    // Redirect back to admin with a success flag
    const frontend = process.env.FRONTEND_URL || 'http://localhost:3000';
    return res.redirect(frontend + '/admin?googleDriveLinked=1');
  } catch (err) {
    console.error('OAuth callback error:', err);
    return res.status(500).send('Failed to complete Google OAuth');
  }
});

module.exports = router;
