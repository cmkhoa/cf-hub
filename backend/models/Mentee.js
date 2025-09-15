const mongoose = require('mongoose');

const menteeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  company: { type: String, trim: true },
  position: { type: String, trim: true },
  location: { type: String, trim: true },
  image: { type: String, trim: true }, // URL or path to image
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0, index: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

menteeSchema.pre('save', function(next){
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Mentee', menteeSchema);
