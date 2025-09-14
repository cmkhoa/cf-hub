const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phoneNumber: { type: String, trim: true },
  location: { type: String, trim: true },
  school: { type: String, trim: true },
  currentYear: { type: String, trim: true },
  industryPreference: { type: String, trim: true },
  helpDescription: { type: String },
  questionsForUs: { type: String },
  waitlistConsideration: { type: String, enum: ['Yes','No'], default: 'No' },
  resumeData: { type: Buffer },
  resumeMime: { type: String },
  resumeOriginalName: { type: String },
  resumeSize: { type: Number },
  status: { type: String, enum: ['submitted','reviewed','accepted','rejected'], default: 'submitted' },
  adminNotes: { type: String },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
}, { timestamps: true });

ApplicationSchema.index({ email: 1, createdAt: -1 });

ApplicationSchema.methods.toJSON = function(){
  const obj = this.toObject();
  // Never send raw resume binary in listings
  delete obj.resumeData;
  return obj;
};

module.exports = mongoose.model('Application', ApplicationSchema);
