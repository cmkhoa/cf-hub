const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Mentee = require('../models/Mentee');
const { body, param, validationResult } = require('express-validator');

function requireAdmin(req,res,next){ if(req.user.role !== 'admin') return res.status(403).json({ message:'Admin only'}); next(); }

// Public: list mentees (ordered)
router.get('/', async (req,res)=>{
  try {
    const items = await Mentee.find().sort({ order: 1, createdAt: -1 });
    res.json(items);
  } catch(err){ res.status(500).json({ message:'Error fetching mentees' }); }
});

// Admin: create
router.post('/', auth, requireAdmin, [
  body('name').trim().isLength({ min: 1 }),
  body('company').optional().isString(),
  body('position').optional().isString(),
  body('location').optional().isString(),
  body('image').optional().isString(),
  body('featured').optional().isBoolean(),
  body('order').optional().isInt({ min: 0 })
], async (req,res)=>{
  const errors = validationResult(req); if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try { const mentee = await Mentee.create(req.body); res.status(201).json(mentee); } catch(err){ res.status(500).json({ message:'Error creating mentee' }); }
});

// Admin: update
router.put('/:id', auth, requireAdmin, [ param('id').isMongoId() ], async (req,res)=>{
  const errors = validationResult(req); if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try { const mentee = await Mentee.findByIdAndUpdate(req.params.id, req.body, { new: true }); if(!mentee) return res.status(404).json({ message:'Not found' }); res.json(mentee); } catch(err){ res.status(500).json({ message:'Error updating mentee' }); }
});

// Admin: delete
router.delete('/:id', auth, requireAdmin, [ param('id').isMongoId() ], async (req,res)=>{
  const errors = validationResult(req); if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try { const mentee = await Mentee.findById(req.params.id); if(!mentee) return res.status(404).json({ message:'Not found' }); await mentee.deleteOne(); res.json({ message:'Deleted' }); } catch(err){ res.status(500).json({ message:'Error deleting mentee' }); }
});

module.exports = router;
