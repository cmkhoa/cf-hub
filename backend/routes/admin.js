const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const AdminAudit = require('../models/AdminAudit');

const router = express.Router();

// Middleware to require admin
function requireAdmin(req,res,next){
  if(!req.user || req.user.role !== 'admin'){
    return res.status(403).json({ message:'Admin privilege required' });
  }
  next();
}

// Promote a user to admin by email
router.post('/users/promote', auth, requireAdmin, [
  body('email').isEmail().withMessage('Valid email required')
], async (req,res)=>{
  try {
    const errors = validationResult(req); if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if(!user) return res.status(404).json({ message:'User not found' });
    if(user.role === 'admin') return res.status(200).json({ message:'User already admin', user: { id: user._id, email: user.email, role: user.role } });
    const prev = user.role;
    user.role = 'admin';
    await user.save();
    await AdminAudit.create({
      action: 'promote',
      targetUser: user._id,
      targetEmail: user.email,
      performedBy: req.user.userId,
      performedByEmail: req.user.email || 'unknown',
      previousRole: prev,
      newRole: user.role
    });
    res.json({ message:'User promoted to admin', user: { id: user._id, email: user.email, role: user.role } });
  } catch(err){
    console.error('Promote admin error', err);
    res.status(500).json({ message:'Failed to promote user' });
  }
});

// Demote an admin back to user (cannot demote self if last admin)
router.post('/users/demote', auth, requireAdmin, [
  body('email').isEmail().withMessage('Valid email required')
], async (req,res)=>{
  try {
    const errors = validationResult(req); if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if(!user) return res.status(404).json({ message:'User not found' });
    if(user.role !== 'admin') return res.status(400).json({ message:'User is not an admin' });
    // Count other admins
    const adminCount = await User.countDocuments({ role: 'admin' });
    if(adminCount <= 1 && user._id.toString() === req.user.userId){
      return res.status(400).json({ message:'Cannot demote the only remaining admin'});
    }
    const prev = user.role;
    user.role = 'user';
    await user.save();
    await AdminAudit.create({
      action: 'demote',
      targetUser: user._id,
      targetEmail: user.email,
      performedBy: req.user.userId,
      performedByEmail: req.user.email || 'unknown',
      previousRole: prev,
      newRole: user.role
    });
    res.json({ message:'User demoted to user', user: { id: user._id, email: user.email, role: user.role } });
  } catch(err){
    console.error('Demote admin error', err);
    res.status(500).json({ message:'Failed to demote user' });
  }
});

// List current admins (basic info)
router.get('/users/admins', auth, requireAdmin, async (_req,res)=>{
  try {
    const admins = await User.find({ role: 'admin' }).select('_id email name role createdAt');
    res.json({ admins });
  } catch(err){
    console.error('List admins error', err);
    res.status(500).json({ message:'Failed to list admins' });
  }
});

module.exports = router;
