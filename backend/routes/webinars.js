const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Webinar = require("../models/Webinar");
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
      const webinar = await Webinar.create(req.body);
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
      const webinar = await Webinar.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!webinar) return res.status(404).json({ message: "Not found" });
      res.json(webinar);
    } catch (err) {
      res.status(500).json({ message: "Error updating webinar" });
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
      await webinar.deleteOne();
      res.json({ message: "Deleted" });
    } catch (err) {
      res.status(500).json({ message: "Error deleting webinar" });
    }
  }
);

module.exports = router;
