const express = require('express');
const router = express.Router();
const multer = require('multer');
const { body, param, query, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Application = require('../models/Application');

// Memory storage for resume (PDF) up to 5MB
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req,file,cb)=>{
    if(file.mimetype !== 'application/pdf') return cb(new Error('Resume must be a PDF'));
    cb(null,true);
  }
});

// Public submission (auth optional); if logged in, tie to user
router.post('/', upload.single('resume'), [
  body('fullName').trim().isLength({ min: 2, max: 120 }),
  body('email').isEmail().normalizeEmail(),
  body('phoneNumber').optional().isString().isLength({ max: 40 }),
  body('location').optional().isString().isLength({ max: 120 }),
  body('school').optional().isString().isLength({ max: 120 }),
  body('currentYear').optional().isString().isLength({ max: 40 }),
  body('industryPreference').optional().isString().isLength({ max: 120 }),
  body('helpDescription').optional().isString().isLength({ max: 2000 }),
  body('questionsForUs').optional().isString().isLength({ max: 1000 }),
  body('waitlistConsideration').optional().isIn(['Yes','No'])
], async (req,res)=>{
  try {
    const errors = validationResult(req); if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const body = req.body;
    const appData = { ...body };
    if(req.file){
      appData.resumeData = req.file.buffer;
      appData.resumeMime = req.file.mimetype;
      appData.resumeOriginalName = req.file.originalname;
      appData.resumeSize = req.file.size;
    }
    // Optionally attach user if bearer token present
    const authHeader = req.header('Authorization');
    if(authHeader){
      try {
        // Reuse auth middleware logic ad-hoc
        const jwt = require('jsonwebtoken');
        const token = authHeader.replace('Bearer ','');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        appData.submittedBy = decoded.userId;
      } catch(e){ /* ignore invalid token for public submission */ }
    }
    const created = await Application.create(appData);
    res.status(201).json({ success:true, applicationId: created._id });
  } catch(err){
    console.error('Application submit error', err);
    res.status(400).json({ success:false, message: err.message });
  }
});

// List my applications (user)
router.get('/mine', auth, async (req,res)=>{
  try {
    const items = await Application.find({ submittedBy: req.user.userId })
      .sort({ createdAt: -1 });
    res.json(items);
  } catch(err){ res.status(500).json({ message:'Error fetching your applications' }); }
});

// Admin list
router.get('/', auth, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('q').optional().isString().isLength({ max: 200 }),
  query('status').optional().isIn(['submitted','reviewed','accepted','rejected'])
], async (req,res)=>{
  try {
    if(req.user.role !== 'admin') return res.status(403).json({ message:'Admin only'});
    const errors = validationResult(req); if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { page=1, limit=20, q, status } = req.query;
    const pg = Math.max(1, parseInt(page));
    const lim = Math.min(100, parseInt(limit));
    const skip = (pg-1)*lim;
    const filter = {};
    if(status) filter.status = status;
    if(q){
      filter.$or = [
        { fullName: { $regex: q, $options:'i' } },
        { email: { $regex: q, $options:'i' } },
        { school: { $regex: q, $options:'i' } }
      ];
    }
    const [items,total] = await Promise.all([
      Application.find(filter).sort({ createdAt:-1 }).skip(skip).limit(lim).populate('submittedBy','name email'),
      Application.countDocuments(filter)
    ]);
    res.json({ page: pg, limit: lim, total, pages: Math.ceil(total/lim), items });
  } catch(err){ res.status(500).json({ message:'Error fetching applications', error: err.message }); }
});

// Admin get single (includes resume meta but not binary); resume binary separate endpoint
router.get('/:id', auth, [ param('id').isMongoId() ], async (req,res)=>{
  try {
    if(req.user.role !== 'admin') return res.status(403).json({ message:'Admin only'});
  const errors = validationResult(req); if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const appDoc = await Application.findById(req.params.id).populate('submittedBy','name email');
    if(!appDoc) return res.status(404).json({ message:'Not found'});
    const obj = appDoc.toObject();
    delete obj.resumeData; // already removed in toJSON, but ensure
    res.json(obj);
  } catch(err){ res.status(500).json({ message:'Error fetching application', error: err.message }); }
});

// Download resume (admin only)
router.get('/:id/resume', auth, [ param('id').isMongoId() ], async (req,res)=>{
  try {
    if(req.user.role !== 'admin') return res.status(403).json({ message:'Admin only'});
  const errors = validationResult(req); if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const appDoc = await Application.findById(req.params.id).select('resumeData resumeMime resumeOriginalName');
    if(!appDoc || !appDoc.resumeData) return res.status(404).json({ message:'No resume' });
    res.setHeader('Content-Type', appDoc.resumeMime || 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${appDoc.resumeOriginalName || 'resume.pdf'}"`);
    res.send(appDoc.resumeData);
  } catch(err){ res.status(500).json({ message:'Error downloading resume', error: err.message }); }
});

// Update status (admin)
router.patch('/:id/status', auth, [ param('id').isMongoId(), body('status').isIn(['submitted','reviewed','accepted','rejected']), body('adminNotes').optional().isString().isLength({ max: 5000 }) ], async (req,res)=>{
  try {
    if(req.user.role !== 'admin') return res.status(403).json({ message:'Admin only'});
  const errors = validationResult(req); if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { status, adminNotes } = req.body;
  const update = { status };
  if(adminNotes !== undefined) update.adminNotes = adminNotes;
  const doc = await Application.findByIdAndUpdate(req.params.id, update, { new:true });
    if(!doc) return res.status(404).json({ message:'Not found'});
    res.json(doc);
  } catch(err){ res.status(500).json({ message:'Error updating status', error: err.message }); }
});

module.exports = router;
