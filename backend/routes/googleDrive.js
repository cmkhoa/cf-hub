const express = require('express');
const { google } = require('googleapis');
const admin = require('../firebaseAdmin');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

function buildOAuthClient() {
  const { GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, GOOGLE_OAUTH_REDIRECT_URL } = process.env;
  if (!GOOGLE_OAUTH_CLIENT_ID || !GOOGLE_OAUTH_CLIENT_SECRET || !GOOGLE_OAUTH_REDIRECT_URL) {
    throw new Error('Missing Google OAuth environment variables');
  }
  return new google.auth.OAuth2(GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, GOOGLE_OAUTH_REDIRECT_URL);
}

async function getStoredTokens(uid) {
  if (!admin.apps.length) throw new Error('Firebase admin not initialized');
  const snap = await admin.firestore().collection('userIntegrations').doc(uid).get();
  const data = snap.data();
  return data?.google?.tokens || null;
}

async function ensureAuthorizedClient(uid) {
  const tokens = await getStoredTokens(uid);
  if (!tokens) {
    const err = new Error('No Google tokens stored for this user');
    err.code = 'NO_TOKENS';
    throw err;
  }
  const client = buildOAuthClient();
  client.setCredentials(tokens);
  // Refresh if expired
  if (tokens.expiry_date && tokens.expiry_date < Date.now() - 60000 && tokens.refresh_token) {
    try {
      const refreshed = await client.refreshAccessToken();
      const newTokens = refreshed.credentials;
      await admin.firestore().collection('userIntegrations').doc(uid).set({
        google: { tokens: { ...tokens, ...newTokens, refreshed_at: Date.now() } }
      }, { merge: true });
      client.setCredentials({ ...tokens, ...newTokens });
    } catch (e) {
      console.warn('Failed to refresh token', e.message);
    }
  }
  return client;
}

// GET /api/google-drive/files - list recent docs
router.get('/files', authMiddleware, async (req, res) => {
  try {
    const client = await ensureAuthorizedClient(req.user.id);
    const drive = google.drive({ version: 'v3', auth: client });
    const { data } = await drive.files.list({
      pageSize: 20,
      fields: 'files(id, name, mimeType, modifiedTime, owners(displayName))',
      orderBy: 'modifiedTime desc',
      q: "mimeType='application/vnd.google-apps.document' and trashed=false"
    });
    return res.json({ files: data.files || [] });
  } catch (err) {
    if (err.code === 'NO_TOKENS') {
      return res.status(401).json({ message: 'Google Drive not linked' });
    }
    console.error('List files error:', err);
    return res.status(500).json({ message: err.message || 'Failed to list files' });
  }
});

// GET /api/google-drive/file/:id/html - export Google Doc as HTML (optional enhancement)
router.get('/file/:id/html', authMiddleware, async (req, res) => {
  try {
    const fileId = req.params.id;
    const client = await ensureAuthorizedClient(req.user.id);
    const drive = google.drive({ version: 'v3', auth: client });
    const response = await drive.files.export({ fileId, mimeType: 'text/html' }, { responseType: 'stream' });
    res.set('Content-Type', 'text/html');
    response.data.on('error', (e) => {
      console.error('Stream error exporting doc:', e);
      if (!res.headersSent) res.status(500).end('Failed to export document');
    });
    response.data.pipe(res);
  } catch (err) {
    if (err.code === 'NO_TOKENS') {
      return res.status(401).json({ message: 'Google Drive not linked' });
    }
    console.error('Export file error:', err);
    return res.status(500).json({ message: err.message || 'Failed to export file' });
  }
});

module.exports = router;
