const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Post = require('../models/Post');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { body, query, param, validationResult } = require('express-validator');

// Ensure uploads dir exists
const uploadDir = path.join(__dirname,'..','uploads');
if(!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (_req,_file,cb)=> cb(null, uploadDir),
  filename: (_req,file,cb)=>{
    const unique = Date.now() + '-' + Math.round(Math.random()*1e9);
    const ext = path.extname(file.originalname || '').toLowerCase();
    cb(null, unique + ext);
  }
});
function fileFilter(_req,file,cb){
  if(!file.mimetype.startsWith('image/')) return cb(new Error('Only image uploads allowed'));
  cb(null,true);
}
const upload = multer({ storage, fileFilter, limits:{ fileSize: 2 * 1024 * 1024 } }); // 2MB limit
const Category = require('../models/Category');
const Tag = require('../models/Tag');

// Helper: pagination params
function getPagination(req){
  const page = Math.max(1, parseInt(req.query.page)||1);
  const limit = Math.min(100, parseInt(req.query.limit)||10);
  const skip = (page-1)*limit;
  return { page, limit, skip };
}

// Create Category
router.post('/categories', auth,
  [
    body('name').trim().isLength({ min:2, max: 60 }),
    body('slug').trim().matches(/^[a-z0-9-]+$/).withMessage('slug kebab-case'),
    body('description').optional().isString().isLength({ max: 200 }),
    body('parent').optional().isMongoId()
  ],
  async (req,res)=>{
  try {
    const errors = validationResult(req); if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { name, slug, description, parent } = req.body;
    const exists = await Category.findOne({ $or:[{name},{slug}] });
    if(exists) return res.status(400).json({ message:'Category exists'});
    const category = await Category.create({ name, slug, description, parent: parent||null });
    res.status(201).json(category);
  } catch(err){ res.status(500).json({ message:'Error creating category', error: err.message }); }
});

// List Categories
router.get('/categories', async (_req,res)=>{
  const cats = await Category.find().sort('name');
  res.json(cats);
});

// Create Tag
router.post('/tags', auth,
  [ body('name').trim().isLength({ min: 1, max: 40 }), body('description').optional().isLength({ max: 140 }) ],
  async (req,res)=>{
  try { const errors = validationResult(req); if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() }); const { name, description } = req.body; const exists = await Tag.findOne({ name: name.toLowerCase() }); if(exists) return res.status(400).json({ message:'Tag exists'}); const tag = await Tag.create({ name: name.toLowerCase(), description }); res.status(201).json(tag); } catch(err){ res.status(500).json({ message:'Error creating tag', error: err.message }); }
});
router.get('/tags', async (_req,res)=>{ const tags = await Tag.find().sort('name'); res.json(tags); });

// Create Post
router.post('/posts', auth, [
  body('title').trim().isLength({ min: 3, max: 160 }),
  body('excerpt').optional().isLength({ max: 400 }),
  body('content').isString().isLength({ min: 20 }),
  body('categories').optional().isArray({ max: 10 }),
  body('tags').optional().isArray({ max: 20 }),
  body('featured').optional().isBoolean()
], async (req,res)=>{
  try {
    const errors = validationResult(req); if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const data = req.body;
    let coverFields = {};
    if(data.coverImageBase64){
      // Expected format: data:<mime>;base64,<payload> OR just base64
      let base64 = data.coverImageBase64;
      let mime = 'image/jpeg';
      const match = /^data:(.*?);base64,(.*)$/.exec(base64);
      if(match){ mime = match[1] || mime; base64 = match[2]; }
      // size guard (~ bytes) base64 length * 3/4
      const approxBytes = Math.floor(base64.length * 0.75);
      const maxBytes = 2 * 1024 * 1024; // 2MB
      if(approxBytes > maxBytes){
        return res.status(413).json({ message:'Cover image too large (max 2MB)' });
      }
      try {
        const buf = Buffer.from(base64, 'base64');
        coverFields.coverImageData = buf;
        coverFields.coverImageMime = mime;
      } catch(e){ /* ignore bad base64 */ }
    }
    // Handle categories and tags: accept arrays of IDs or slugs/names
    let categoryIds = [];
    if(Array.isArray(data.categories) && data.categories.length){
      const catQuery = { $or: [ { _id: { $in: data.categories.filter(c=> c.match(/^[0-9a-fA-F]{24}$/)) } }, { slug: { $in: data.categories } } ] };
      const cats = await Category.find(catQuery).select('_id');
      categoryIds = cats.map(c=>c._id);
    }
    let tagIds = [];
    if(Array.isArray(data.tags) && data.tags.length){
      // Ensure tags exist or create them by name (lowercase)
      const tagNames = data.tags.map(t=> String(t).toLowerCase());
      const existing = await Tag.find({ name: { $in: tagNames } });
      const existingMap = new Map(existing.map(t=> [t.name, t]));
      for(const name of tagNames){
        if(!existingMap.has(name)){
          const created = await Tag.create({ name });
          existingMap.set(name, created);
        }
      }
      tagIds = Array.from(existingMap.values()).map(t=> t._id);
    }
    // Enforce moderation and field whitelist for non-admins
    const isAdmin = req.user.role === 'admin';
    const allowedFields = ['postType','title','excerpt','content','meta'];
    // For non-admins, ignore featured/status/publishedAt/author overrides
    const toInsert = { author: req.user.userId, categories: categoryIds, tags: tagIds, ...coverFields };
    for(const k of allowedFields){ if(data[k] !== undefined) toInsert[k] = data[k]; }
    if(isAdmin){
      if(typeof data.featured === 'boolean') toInsert.featured = data.featured;
      if(data.status && ['draft','submitted','published','archived'].includes(data.status)) toInsert.status = data.status;
    } else {
      toInsert.status = 'submitted';
      toInsert.featured = false;
    }
    if(!toInsert.postType) toInsert.postType = 'blog';
    const post = await Post.create(toInsert);
    res.status(201).json(post);
  } catch(err){ res.status(500).json({ message:'Error creating post', error: err.message }); }
});

// Upload cover image (returns relative path)
router.post('/posts/upload/cover', auth, upload.single('image'), (req,res)=>{
  if(!req.file) return res.status(400).json({ message:'No file uploaded' });
  const rel = `/uploads/${req.file.filename}`;
  res.status(201).json({ path: rel });
});

// Update Post (author or admin)
router.put('/posts/:id', auth, [
  param('id').isMongoId(),
  body('title').optional().isString().isLength({ min: 3, max: 160 }),
  body('excerpt').optional().isString().isLength({ max: 400 }),
  body('content').optional().isString().isLength({ min: 20 }),
  body('categories').optional().isArray({ max: 10 }),
  body('tags').optional().isArray({ max: 20 }),
  body('featured').optional().isBoolean(),
  body('status').optional().isIn(['draft','submitted','published','archived'])
], async (req,res)=>{
  try {
    const errors = validationResult(req); if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const post = await Post.findById(req.params.id);
    if(!post) return res.status(404).json({ message:'Post not found' });
    const isOwner = String(post.author) === req.user.userId;
    const isAdmin = req.user.role === 'admin';
    if(!isOwner && !isAdmin) return res.status(403).json({ message:'Not allowed' });
    const data = req.body || {};
    const updates = {};
    if(updates.coverImageBase64){
      let base64 = updates.coverImageBase64;
      let mime = 'image/jpeg';
      const match = /^data:(.*?);base64,(.*)$/.exec(base64);
      if(match){ mime = match[1] || mime; base64 = match[2]; }
      const approxBytes = Math.floor(base64.length * 0.75);
      const maxBytes = 2 * 1024 * 1024; // 2MB
      if(approxBytes > maxBytes){
        return res.status(413).json({ message:'Cover image too large (max 2MB)' });
      }
      try {
        post.coverImageData = Buffer.from(base64,'base64');
        post.coverImageMime = mime;
      } catch(e){ /* ignore invalid */ }
      delete updates.coverImageBase64;
    }
    // categories update
    if(Array.isArray(data.categories)){
      const catQuery = { $or: [ { _id: { $in: data.categories.filter(c=> c.match(/^[0-9a-fA-F]{24}$/)) } }, { slug: { $in: data.categories } } ] };
      const cats = await Category.find(catQuery).select('_id');
      post.categories = cats.map(c=>c._id);
    }
    // tags update
    if(Array.isArray(data.tags)){
      const tagNames = data.tags.map(t=> String(t).toLowerCase());
      const existing = await Tag.find({ name: { $in: tagNames } });
      const existingMap = new Map(existing.map(t=> [t.name, t]));
      for(const name of tagNames){
        if(!existingMap.has(name)){
          const created = await Tag.create({ name });
          existingMap.set(name, created);
        }
      }
      post.tags = Array.from(existingMap.values()).map(t=> t._id);
    }
    // Whitelist updatable fields
    const allowed = ['title','excerpt','content','meta'];
    for(const k of allowed){ if(data[k] !== undefined) post[k] = data[k]; }
    if(isAdmin){
      if(typeof data.featured === 'boolean') post.featured = data.featured;
      if(data.status && ['draft','submitted','published','archived'].includes(data.status)) post.status = data.status;
    } else {
      // Non-admin cannot publish directly
      if(data.status === 'published') post.status = 'submitted';
      // Ignore featured field from non-admins
    }
    await post.save();
    res.json(post);
  } catch(err){ res.status(500).json({ message:'Error updating post', error: err.message }); }
});

// Publish / Unpublish
function requireAdmin(req,res,next){ if(req.user.role !== 'admin') return res.status(403).json({ message:'Admin only'}); next(); }
router.post('/posts/:id/publish', auth, requireAdmin, async (req,res)=>{
  try { const post = await Post.findById(req.params.id); if(!post) return res.status(404).json({ message:'Post not found'}); post.status='published'; await post.save(); res.json(post); } catch(err){ res.status(500).json({ message:'Error publishing post', error: err.message }); }
});
router.post('/posts/:id/unpublish', auth, requireAdmin, async (req,res)=>{
  try { const post = await Post.findById(req.params.id); if(!post) return res.status(404).json({ message:'Post not found'}); post.status='draft'; await post.save(); res.json(post); } catch(err){ res.status(500).json({ message:'Error unpublishing post', error: err.message }); }
});

// Get posts (filtering)
router.get('/posts', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('featured').optional().isBoolean().toBoolean(),
  query('category').optional().isString(),
  query('categories').optional().isString(),
  query('q').optional().isString().isLength({ max: 200 }),
  query('tags').optional().isString(),
  query('tagsMode').optional().isIn(['any','all']),
  query('postType').optional().isIn(['blog','success'])
], async (req,res)=>{
  try {
    const errors = validationResult(req); if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { page, limit, skip } = getPagination(req);
    const { status, category, categories: multiCategories, tag, q, featured, postType, sort, tags, tagsMode } = req.query;
    const filter = {};
    // Optional token to allow admin to query non-published content
    let isAdmin = false;
    const authHeader = req.header('Authorization');
    if(authHeader){
      try {
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(authHeader.replace('Bearer ', ''), process.env.JWT_SECRET);
        isAdmin = decoded.role === 'admin';
      } catch(e){ /* ignore invalid token */ }
    }
    if(status && isAdmin){
      filter.status = status;
    } else {
      // Public default: only published
      filter.status = 'published';
    }
    if(typeof featured === 'boolean') filter.featured = featured;
    // Single category (slug or id)
    if(category){
      // Accept either a Mongo ObjectId or a slug string
      if(category.match && category.match(/^[0-9a-fA-F]{24}$/)){
        filter.categories = category;
      } else {
        try {
          const catDoc = await Category.findOne({ slug: category }).select('_id');
          if(catDoc) filter.categories = catDoc._id;
          else filter.categories = { $in: [] }; // force empty result if slug not found
        } catch(e){ filter.categories = { $in: [] }; }
      }
    }
    // Multi-categories: comma-separated list of slugs or ids
    if(multiCategories){
      const raw = String(multiCategories).split(',').map(s=> s.trim()).filter(Boolean);
      const ids = raw.filter(v=> /^[0-9a-fA-F]{24}$/.test(v));
      const slugs = raw.filter(v=> !/^[0-9a-fA-F]{24}$/.test(v));
      let resolved = [];
      if(slugs.length){
        const found = await Category.find({ slug: { $in: slugs } }).select('_id');
        resolved = found.map(c=> String(c._id));
      }
      const all = Array.from(new Set([...ids, ...resolved]));
      if(all.length){
        filter.categories = { $in: all };
      } else {
        filter.categories = { $in: [] };
      }
    }
    if(tag) filter.tags = tag;
  if(postType) filter.postType = postType;
    if(q){ filter.$text = { $search: q }; }
    // Multi-tag filter (names case-insensitive) ?tags=tag1,tag2
    if(tags){
      const list = tags.split(',').map(t=> t.trim().toLowerCase()).filter(Boolean);
      if(list.length){
        const tagDocs = await Tag.find({ name: { $in: list } }).select('_id');
        const ids = tagDocs.map(t=> t._id);
        if(ids.length){
          filter.tags = tagsMode === 'all' ? { $all: ids } : { $in: ids };
        } else {
          // Force empty result if no matching tag names
          filter.tags = { $in: [] };
        }
      }
    }
    let sortSpec = { publishedAt: -1, createdAt:-1 };
    if(sort === 'views') sortSpec = { views: -1, publishedAt: -1 };

    const queryObj = Post.find(filter)
      .populate('author','name profile')
      .populate('categories','name slug')
      .populate('tags','name')
      .sort(sortSpec)
      .skip(skip)
      .limit(limit);

    const [items, total] = await Promise.all([
      queryObj,
      Post.countDocuments(filter)
    ]);

    res.json({ page, limit, total, pages: Math.ceil(total/limit), items });
  } catch(err){ res.status(500).json({ message:'Error fetching posts', error: err.message }); }
});

// Get single post by slug
router.get('/posts/slug/:slug', async (req,res)=>{
  try { const post = await Post.findOne({ slug: req.params.slug, status:'published' })
    .populate('author','name profile')
    .populate('categories','name slug')
    .populate('tags','name');
    if(!post) return res.status(404).json({ message:'Post not found' });
    // Increment view count (non-blocking)
    Post.updateOne({ _id: post._id }, { $inc: { views: 1 } }).exec();
    res.json(post); } catch(err){ res.status(500).json({ message:'Error fetching post', error: err.message }); }
});

// Serve cover image by post id
router.get('/posts/:id/cover', async (req,res)=>{
  try {
    const post = await Post.findById(req.params.id).select('coverImageData coverImageMime');
    if(!post || !post.coverImageData) return res.status(404).end();
    res.setHeader('Content-Type', post.coverImageMime || 'image/jpeg');
    res.setHeader('Cache-Control','public, max-age=3600');
    res.send(post.coverImageData);
  } catch(err){ res.status(500).json({ message:'Error fetching cover image' }); }
});

// Get single post by id (drafts allowed for owner)
router.get('/posts/:id', auth, async (req,res)=>{
  try { const post = await Post.findById(req.params.id)
    .populate('author','name profile')
    .populate('categories','name slug')
    .populate('tags','name');
    if(!post) return res.status(404).json({ message:'Post not found' });
    const isOwner = String(post.author._id) === req.user.userId;
    const isAdmin = req.user.role === 'admin';
    if(post.status !== 'published' && !isOwner && !isAdmin){
      return res.status(403).json({ message:'Not allowed'});
    }
    res.json(post); } catch(err){ res.status(500).json({ message:'Error fetching post', error: err.message }); }
});

// Delete post
router.delete('/posts/:id', auth, async (req,res)=>{
  try { const post = await Post.findById(req.params.id); if(!post) return res.status(404).json({ message:'Post not found'}); const isOwner = String(post.author) === req.user.userId; const isAdmin = req.user.role === 'admin'; if(!isOwner && !isAdmin) return res.status(403).json({ message:'Not allowed'}); await post.deleteOne(); res.json({ message:'Deleted' }); } catch(err){ res.status(500).json({ message:'Error deleting post', error: err.message }); }
});

module.exports = router;
