const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Webinar = require("../models/Webinar");
const { uploadBufferToR2, deleteObjectFromR2 } = require('../config/r2');
const { body, param, validationResult } = require("express-validator");

function requireAdmin(req, res, next) {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Admin only" });
  next();
}

// Public: list webinars (ordered)
router.get("/", async (req, res) => {
  try {
    const items = await Webinar.find().sort({
      order: 1,
      date: -1,
      createdAt: -1,
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Error fetching webinars" });
  }
});

// Serve webinar image (redirects to R2 public URL if key is stored)
router.get('/:id/image', async (req, res) => {
  try {
    const w = await Webinar.findById(req.params.id).select('image');
    if (!w) return res.status(404).json({ message: 'Not found' });
    if (w.image) {
      // Absolute URL: redirect
      if (/^https?:\/\//i.test(w.image)) return res.redirect(w.image);
      // R2 key: attempt to stream directly
      try {
        const { getObjectFromR2, getPublicUrl } = require('../config/r2');
        try {
          const obj = await getObjectFromR2({ Key: w.image });
          res.setHeader('Content-Type', obj.ContentType || 'image/jpeg');
          if (obj.ContentLength) res.setHeader('Content-Length', String(obj.ContentLength));
          res.setHeader('Cache-Control', 'public, max-age=3600');
          return obj.Body.pipe(res);
        } catch (e) {
          // Fallback to redirecting to a public URL (if bucket/CDN is public)
          const url = getPublicUrl(w.image);
          return res.redirect(url);
        }
      } catch (e) {
        // fall through to placeholder
      }
    }
    // 1x1 transparent PNG
    const png = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9WmK+S8AAAAASUVORK5CYII=';
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=300');
    return res.send(Buffer.from(png, 'base64'));
  } catch (err) {
    res.status(500).json({ message: 'Error fetching image' });
  }
});

// Admin: create
router.post(
  "/",
  auth,
  requireAdmin,
  [
    body("title").trim().isLength({ min: 1 }),
    body("description").optional().isString(),
    body("date").optional().isISO8601().toDate(),
    body("speakerName").optional().isString(),
    body("speakerTitle").optional().isString(),
    body("image").optional().isString(),
    body("registrationUrl").optional().isString(),
    body("recordingUrl").optional().isString(),
    body("featured").optional().isBoolean(),
    body("order").optional().isInt({ min: 0 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    try {
      const data = { ...req.body };
      // Handle image upload from base64 (optional)
      if (data.imageBase64) {
        try {
          let base64 = data.imageBase64;
          let mime = 'image/jpeg';
          const match = /^data:(.*?);base64,(.*)$/.exec(base64);
          if (match) { mime = match[1] || mime; base64 = match[2]; }
          const approxBytes = Math.floor(base64.length * 0.75);
          const maxBytes = 2 * 1024 * 1024; // 2MB
          if (approxBytes > maxBytes) return res.status(413).json({ message: 'Image too large (max 2MB)' });
          const buf = Buffer.from(base64, 'base64');
          const key = `webinars/${Date.now()}-image.jpg`;
          const out = await uploadBufferToR2({ Key: key, Body: buf, ContentType: mime });
          data.image = out.key || key;
        } catch (e) {
          console.error('Webinar image upload failed:', e.message);
          // Remove image field if upload failed
          delete data.image;
        }
        delete data.imageBase64;
      }
      const webinar = await Webinar.create(data);
      res.status(201).json(webinar);
    } catch (err) {
      res.status(500).json({ message: "Error creating webinar" });
    }
  }
);

// Admin: update
router.put(
  "/:id",
  auth,
  requireAdmin,
  [param("id").isMongoId()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    try {
      const webinar = await Webinar.findById(req.params.id);
      if (!webinar) return res.status(404).json({ message: 'Not found' });
      const data = { ...req.body };
      // Handle image replacement
      if (data.imageBase64) {
        try {
          let base64 = data.imageBase64;
          let mime = 'image/jpeg';
          const match = /^data:(.*?);base64,(.*)$/.exec(base64);
          if (match) { mime = match[1] || mime; base64 = match[2]; }
          const approxBytes = Math.floor(base64.length * 0.75);
          const maxBytes = 2 * 1024 * 1024; // 2MB
          if (approxBytes > maxBytes) return res.status(413).json({ message: 'Image too large (max 2MB)' });
          const buf = Buffer.from(base64, 'base64');
          const key = `webinars/${Date.now()}-image.jpg`;
          const out = await uploadBufferToR2({ Key: key, Body: buf, ContentType: mime });
          // Delete previous R2 object if webinar.image looks like a key (not absolute URL)
          if (webinar.image && !/^https?:\/\//i.test(webinar.image)) {
            try { await deleteObjectFromR2({ Key: webinar.image }); } catch (e) { /* ignore */ }
          }
          webinar.image = out.key || key;
        } catch (e) {
          console.error('Webinar image upload failed:', e.message);
        }
        delete data.imageBase64;
        delete data.image; // prevent overwriting with stale image value
      }
      // Whitelist updatable fields
      const allowed = ['title','description','date','speakerName','speakerTitle','registrationUrl','recordingUrl','featured','order'];
      for (const k of allowed) {
        if (data[k] !== undefined) webinar[k] = data[k];
      }
      await webinar.save();
      res.json(webinar);
    } catch (err) {
      res.status(500).json({ message: 'Error updating webinar' });
    }
  }
);

// Admin: delete
router.delete(
  "/:id",
  auth,
  requireAdmin,
  [param("id").isMongoId()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    try {
      const webinar = await Webinar.findById(req.params.id);
      if (!webinar) return res.status(404).json({ message: "Not found" });
      // Attempt to delete associated R2 image if stored as key
      if (webinar.image && !/^https?:\/\//i.test(webinar.image)) {
        try { await deleteObjectFromR2({ Key: webinar.image }); } catch (e) { /* ignore */ }
      }
      await webinar.deleteOne();
      res.json({ message: "Deleted" });
    } catch (err) {
      res.status(500).json({ message: "Error deleting webinar" });
    }
  }
);

module.exports = router;
