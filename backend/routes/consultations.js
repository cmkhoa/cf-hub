const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { body, query, param, validationResult } = require('express-validator');
const ConsultationRequest = require('../models/ConsultationRequest');

// Create a consultation request (user)
router.post('/', auth,
  [
    body('name').trim().isLength({ min: 2, max: 80 }),
    body('email').isEmail().normalizeEmail(),
    body('preferredMentor').optional().isString().isLength({ max: 80 }),
    body('topic').optional().isString().isLength({ max: 120 }),
    body('goals').optional().isString().isLength({ max: 1000 }),
    body('availability').optional().isString().isLength({ max: 200 }),
    body('timezone').optional().isString().isLength({ max: 60 }),
    body('contactMethod').optional().isString().isLength({ max: 40 })
  ],
  async (req,res)=>{
  try {
    const errors = validationResult(req); if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { name, email, preferredMentor, topic, goals, availability, timezone, contactMethod } = req.body;
    const doc = await ConsultationRequest.create({
      user: req.user.userId,
      name, email, preferredMentor, topic, goals, availability, timezone, contactMethod
    });
    res.status(201).json(doc);
  } catch(err){ res.status(400).json({ message: 'Could not create request', error: err.message }); }
});

// List my requests (user)
router.get('/mine', auth, async (req,res)=>{
  try {
    const items = await ConsultationRequest.find({ user: req.user.userId }).sort({ createdAt:-1 });
    res.json(items);
  } catch(err){ res.status(500).json({ message:'Error fetching your requests' }); }
});

// Admin: list all
router.get('/', auth, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['pending','approved','rejected','scheduled','completed']),
  query('q').optional().isString().isLength({ max: 200 })
], async (req,res)=>{
  try { if(req.user.role !== 'admin') return res.status(403).json({ message:'Admin only' });
    const errors = validationResult(req); if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { page=1, limit=20, status, q } = req.query;
    const pg = Math.max(1, parseInt(page));
    const lim = Math.min(100, parseInt(limit));
    const skip = (pg-1)*lim;
    const filter = {};
    if(status) filter.status = status;
    if(q){ filter.$or = [ { name: { $regex:q, $options:'i' } }, { email: { $regex:q, $options:'i' } }, { topic: { $regex:q, $options:'i' } } ]; }
    const [items,total] = await Promise.all([
      ConsultationRequest.find(filter).sort({ createdAt:-1 }).skip(skip).limit(lim).populate('user','name email'),
      ConsultationRequest.countDocuments(filter)
    ]);
    res.json({ page: pg, limit: lim, total, pages: Math.ceil(total/lim), items });
  } catch(err){ res.status(500).json({ message:'Error fetching requests' }); }
});

// Admin: update status/assignment
router.patch('/:id', auth, [
  param('id').isMongoId(),
  body('status').optional().isIn(['pending','approved','rejected','scheduled','completed']),
  body('adminNotes').optional().isString().isLength({ max: 2000 }),
  body('assignedMentor').optional().isString().isLength({ max: 80 })
], async (req,res)=>{
  try { if(req.user.role !== 'admin') return res.status(403).json({ message:'Admin only' });
    const errors = validationResult(req); if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const updates = {};
    const { status, adminNotes, assignedMentor } = req.body;
    if(status) updates.status = status;
    if(adminNotes !== undefined) updates.adminNotes = adminNotes;
    if(assignedMentor !== undefined) updates.assignedMentor = assignedMentor;
    updates.updatedAt = new Date();
    const doc = await ConsultationRequest.findByIdAndUpdate(req.params.id, updates, { new:true });
    if(!doc) return res.status(404).json({ message:'Not found' });
    res.json(doc);
  } catch(err){ res.status(400).json({ message:'Update failed', error: err.message }); }
});

module.exports = router;
