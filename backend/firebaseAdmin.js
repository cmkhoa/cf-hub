const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin only once
if (!admin.apps.length) {
  // Prefer JSON credentials via env var (base64) or file path
  let credentials = null;
  if (process.env.FIREBASE_SERVICE_ACCOUNT_B64) {
    try {
      const json = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_B64, 'base64').toString('utf8');
      credentials = JSON.parse(json);
    } catch (e) {
      console.warn('Failed to parse FIREBASE_SERVICE_ACCOUNT_B64');
    }
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT_FILE) {
    try {
      const p = path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_FILE);
      credentials = JSON.parse(fs.readFileSync(p, 'utf8'));
    } catch (e) {
      console.warn('Failed to read FIREBASE_SERVICE_ACCOUNT_FILE');
    }
  }

  if (credentials) {
    admin.initializeApp({
      credential: admin.credential.cert(credentials)
    });
    console.log('Firebase Admin initialized');
  } else {
    console.warn('Firebase Admin not initialized (no credentials provided). Firebase login exchange will fail.');
  }
}

module.exports = admin;
