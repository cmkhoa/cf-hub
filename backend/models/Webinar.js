const mongoose = require("mongoose");

const webinarSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  date: { type: Date },
  speakerName: { type: String, trim: true },
  speakerTitle: { type: String, trim: true },
  image: { type: String, trim: true }, // URL or path to image
  registrationUrl: { type: String, trim: true },
  recordingUrl: { type: String, trim: true },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0, index: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

webinarSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("Webinar", webinarSchema);
