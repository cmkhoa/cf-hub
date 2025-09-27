const mongoose = require('mongoose');

const adminAuditSchema = new mongoose.Schema({
  action: { type: String, enum: ['promote','demote'], required: true },
  targetUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetEmail: { type: String, required: true },
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  performedByEmail: { type: String, required: true },
  previousRole: { type: String },
  newRole: { type: String },
  createdAt: { type: Date, default: Date.now }
}, { indexes: [{ action:1, createdAt:-1 }] });

module.exports = mongoose.model('AdminAudit', adminAuditSchema);
