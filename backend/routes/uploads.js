const express = require('express');
const router = express.Router();
const multer = require('multer');
// @vercel/blob is ESM-only; import dynamically when needed
const auth = require('../middleware/auth');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } }); // 8MB

function sanitizeName(name){
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}

// Admin-only upload endpoint (adjust to allow authenticated users if desired)
router.post('/', auth, async (req, res, next) => {
  // Multer within async handler to handle errors properly
  upload.single('file')(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });
    try {
      if(!req.user || req.user.role !== 'admin') return res.status(403).json({ message:'Admin only' });
      if (!req.file) return res.status(400).json({ message: 'file is required' });
      const original = sanitizeName(req.file.originalname || 'upload');
      const key = `uploads/${Date.now()}-${original}`;
      const contentType = req.file.mimetype || 'application/octet-stream';
      // Upload to Vercel Blob (requires BLOB_READ_WRITE_TOKEN in env on Vercel project)
  const { put } = await import('@vercel/blob');
  const result = await put(key, req.file.buffer, { access: 'public', contentType, addRandomSuffix: false });
      return res.json({ url: result.url, pathname: result.pathname, contentType, size: req.file.size });
    } catch (e) {
      console.error('Blob upload failed:', e);
      return res.status(500).json({ message: 'Upload failed' });
    }
  });
});

module.exports = router;
