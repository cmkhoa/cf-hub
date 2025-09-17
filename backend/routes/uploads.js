const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/auth');
const { uploadBufferToR2 } = require('../config/r2');

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
  const result = await uploadBufferToR2({ Key: key, Body: req.file.buffer, ContentType: contentType });
  return res.json({ url: result.url, pathname: result.key || key, contentType, size: req.file.size });
    } catch (e) {
  console.error('R2 upload failed:', e);
  return res.status(500).json({ message: 'Upload failed', error: e.message });
    }
  });
});

module.exports = router;
