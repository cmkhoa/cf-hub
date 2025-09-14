const mongoose = require('mongoose');

const consultationRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  preferredMentor: { type: String, trim: true },
  topic: { type: String, trim: true },
  goals: { type: String, trim: true },
  availability: { type: String, trim: true },
  timezone: { type: String, trim: true },
  contactMethod: { type: String, trim: true },
  status: { type: String, enum: ['submitted','reviewed','assigned','scheduled','completed','rejected'], default: 'submitted', index: true },
  adminNotes: { type: String, trim: true },
  assignedMentor: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

consultationRequestSchema.pre('save', function(next){
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('ConsultationRequest', consultationRequestSchema);
