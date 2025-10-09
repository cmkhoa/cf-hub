const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Post = require("../models/Post");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { body, query, param, validationResult } = require("express-validator");
const { sanitizeContent } = require('../utils/sanitizeContent');

// Ensure uploads dir exists
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname || "").toLowerCase();
    cb(null, unique + ext);
  },
});
function fileFilter(_req, file, cb) {
  if (!file.mimetype.startsWith("image/"))
    return cb(new Error("Only image uploads allowed"));
  cb(null, true);
}
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
}); // 2MB limit
const Category = require("../models/Category");
const Tag = require("../models/Tag");

// Allowed career story categories (auto-create if selected and not present)
const CAREER_CATEGORY_MAP = {
  "resume-tips": "Resume Tips",
  "interview-tips": "Interview Tips",
  "technical-tips": "Technical Tips",
};

function slugToName(slug) {
  if (!slug) return "";
  if (CAREER_CATEGORY_MAP[slug]) return CAREER_CATEGORY_MAP[slug];
  return String(slug)
    .split("-")
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

// Helper: pagination params
function getPagination(req) {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, parseInt(req.query.limit) || 10);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

// Create Category
router.post(
  "/categories",
  auth,
  [
    body("name").trim().isLength({ min: 2, max: 60 }),
    body("slug")
      .trim()
      .matches(/^[a-z0-9-]+$/)
      .withMessage("slug kebab-case"),
    body("description").optional().isString().isLength({ max: 200 }),
    body("parent").optional().isMongoId(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });
      const { name, slug, description, parent } = req.body;
      const exists = await Category.findOne({ $or: [{ name }, { slug }] });
      if (exists) return res.status(400).json({ message: "Category exists" });
      const category = await Category.create({
        name,
        slug,
        description,
        parent: parent || null,
      });
      res.status(201).json(category);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error creating category", error: err.message });
    }
  }
);

// List Categories
router.get("/categories", async (_req, res) => {
  const cats = await Category.find().sort("name");
  res.json(cats);
});

// Create Tag
router.post(
  "/tags",
  auth,
  [
    body("name").trim().isLength({ min: 1, max: 40 }),
    body("description").optional().isLength({ max: 140 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });
      const { name, description } = req.body;
      const exists = await Tag.findOne({ name: name.toLowerCase() });
      if (exists) return res.status(400).json({ message: "Tag exists" });
      const tag = await Tag.create({ name: name.toLowerCase(), description });
      res.status(201).json(tag);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error creating tag", error: err.message });
    }
  }
);
router.get("/tags", async (_req, res) => {
  const tags = await Tag.find().sort("name");
  res.json(tags);
});

// Create Post
router.post(
  "/posts",
  auth,
  [
    body("title").trim().isLength({ min: 3, max: 160 }),
    body("excerpt").optional().isLength({ max: 400 }),
  body("content").isString().isLength({ min: 20 }),
    body("category").optional().isString(),
    body("tags").optional().isArray({ max: 20 }),
    body("featured").optional().isBoolean(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });
      const data = req.body;
      if(data.content){ data.content = sanitizeContent(data.content); }
      // Enforce category presence for blog posts
      if ((data.postType === undefined || data.postType === 'blog') && !data.category) {
        return res.status(400).json({ message: 'Category is required for blog posts' });
      }
      let coverFields = {};
      if (data.coverImageBase64) {
        // Expected format: data:<mime>;base64,<payload> OR just base64
        let base64 = data.coverImageBase64;
        let mime = "image/jpeg";
        const match = /^data:(.*?);base64,(.*)$/.exec(base64);
        if (match) {
          mime = match[1] || mime;
          base64 = match[2];
        }
        // size guard (~ bytes) base64 length * 3/4
        const approxBytes = Math.floor(base64.length * 0.75);
        const maxBytes = 2 * 1024 * 1024; // 2MB
        if (approxBytes > maxBytes) {
          return res
            .status(413)
            .json({ message: "Cover image too large (max 2MB)" });
        }
        try {
          const buf = Buffer.from(base64, "base64");
          // Upload to R2 and store key/url in coverImage
          const fileName = `cover-${Date.now()}.jpg`;
          const key = `uploads/${fileName}`;
          try {
            const { uploadBufferToR2 } = require('../config/r2');
            const resR2 = await uploadBufferToR2({ Key: key, Body: buf, ContentType: mime });
            coverFields.coverImage = resR2.key || key;
            // do not store binary in DB for new uploads
          } catch (e) {
            // If R2 upload fails, fallback to storing binary in DB
            console.error('R2 upload failed, falling back to DB storage:', e.message);
            coverFields.coverImageData = buf;
            coverFields.coverImageMime = mime;
          }
        } catch (e) {
          /* ignore bad base64 */
        }
      }
      // Handle category: accept single ID or slug (auto-create for allowed slugs)
      let categoryId = null;
      if (data.category) {
        if (String(data.category).match(/^[0-9a-fA-F]{24}$/)) {
          categoryId = data.category;
        } else {
          let cat = await Category.findOne({ slug: data.category }).select(
            "_id"
          );
          if (!cat) {
            // Auto-create for any provided slug (uses mapping for known labels)
            const created = await Category.create({
              name: slugToName(data.category),
              slug: data.category,
            });
            cat = { _id: created._id };
          }
          if (cat) categoryId = cat._id;
        }
      }
      let tagIds = [];
      if (Array.isArray(data.tags) && data.tags.length) {
        // Ensure tags exist or create them by name (lowercase)
        const tagNames = data.tags.map((t) => String(t).toLowerCase());
        const existing = await Tag.find({ name: { $in: tagNames } });
        const existingMap = new Map(existing.map((t) => [t.name, t]));
        for (const name of tagNames) {
          if (!existingMap.has(name)) {
            const created = await Tag.create({ name });
            existingMap.set(name, created);
          }
        }
        tagIds = Array.from(existingMap.values()).map((t) => t._id);
      }
      // Enforce moderation and field whitelist for non-admins
      const isAdmin = req.user.role === "admin";
      const allowedFields = ["postType", "title", "excerpt", "content", "meta"];
      // For non-admins, ignore featured/status/publishedAt/author overrides
      const toInsert = {
        author: req.user.userId,
        category: categoryId,
        tags: tagIds,
        ...coverFields,
      };
      for (const k of allowedFields) {
        if (data[k] !== undefined) toInsert[k] = data[k];
      }
      if (isAdmin) {
        if (typeof data.featured === "boolean")
          toInsert.featured = data.featured;
        if (
          data.status &&
          ["draft", "submitted", "published", "archived"].includes(data.status)
        )
          toInsert.status = data.status;
      } else {
        toInsert.status = "submitted";
        toInsert.featured = false;
      }
      if (!toInsert.postType) toInsert.postType = "blog";
      const post = await Post.create(toInsert);
      res.status(201).json(post);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error creating post", error: err.message });
    }
  }
);

// Upload cover image (uploads to R2 and returns URL + key)
const { uploadBufferToR2 } = require('../config/r2');
router.post("/posts/upload/cover", auth, upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  try {
    if(!req.user || req.user.role !== 'admin') return res.status(403).json({ message: 'Admin only' });
    const original = req.file.originalname ? req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_') : 'upload';
    const key = `uploads/${Date.now()}-${original}`;
    const contentType = req.file.mimetype || 'application/octet-stream';
    const result = await uploadBufferToR2({ Key: key, Body: req.file.buffer, ContentType: contentType });
    return res.status(201).json({ url: result.url, key: result.key, contentType, size: req.file.size });
  } catch (e) {
    console.error('Cover upload failed:', e);
    return res.status(500).json({ message: 'Upload failed', error: e.message });
  }
});

// Update Post (author or admin)
router.put(
  "/posts/:id",
  auth,
  [
    param("id").isMongoId(),
    body("title").optional().isString().isLength({ min: 3, max: 160 }),
    body("excerpt").optional().isString().isLength({ max: 400 }),
  body("content").optional().isString().isLength({ min: 20 }),
    body("category").optional().isString(),
    body("tags").optional().isArray({ max: 20 }),
    body("featured").optional().isBoolean(),
    body("status")
      .optional()
      .isIn(["draft", "submitted", "published", "archived"]),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });
      const post = await Post.findById(req.params.id);
      if (!post) return res.status(404).json({ message: "Post not found" });
      const isOwner = String(post.author) === req.user.userId;
      const isAdmin = req.user.role === "admin";
      if (!isOwner && !isAdmin)
        return res.status(403).json({ message: "Not allowed" });
      const data = req.body || {};
      if(data.content){ data.content = sanitizeContent(data.content); }
      // If this is (or will remain) a blog post, ensure category not removed
      const resultingType = data.postType || post.postType || 'blog';
      if (resultingType === 'blog') {
        if (data.category === null || data.category === '') {
          return res.status(400).json({ message: 'Category cannot be removed from a blog post' });
        }
      }
      // Handle cover image replacement when provided
      if (data.coverImageBase64) {
        let base64 = data.coverImageBase64;
        let mime = "image/jpeg";
        const match = /^data:(.*?);base64,(.*)$/.exec(base64);
        if (match) {
          mime = match[1] || mime;
          base64 = match[2];
        }
        const approxBytes = Math.floor(base64.length * 0.75);
        const maxBytes = 2 * 1024 * 1024; // 2MB
        if (approxBytes > maxBytes) {
          return res
            .status(413)
            .json({ message: "Cover image too large (max 2MB)" });
        }
        try {
          const buf = Buffer.from(base64, "base64");
          const { uploadBufferToR2, deleteObjectFromR2 } = require('../config/r2');
          const fileName = `cover-${Date.now()}.jpg`;
          const key = `uploads/${fileName}`;
          try {
            const r2res = await uploadBufferToR2({ Key: key, Body: buf, ContentType: mime });
            // If previous coverImage referenced R2, delete it
            if (post.coverImage && typeof post.coverImage === 'string' && !/^https?:\/\//i.test(post.coverImage)) {
              // assume stored key
              try {
                await deleteObjectFromR2({ Key: post.coverImage });
              } catch (e) {
                console.error('Failed to delete previous R2 object:', e.message);
              }
            }
            post.coverImage = r2res.key || key;
            post.coverImageData = undefined;
            post.coverImageMime = undefined;
          } catch (e) {
            console.error('R2 upload failed, falling back to DB storage:', e.message);
            post.coverImageData = buf;
            post.coverImageMime = mime;
            post.coverImage = undefined;
          }
        } catch (e) {
          /* ignore invalid */
        }
        delete data.coverImageBase64;
      }
      // category update (auto-create for allowed slugs)
      if (data.category !== undefined) {
        if (data.category) {
          if (String(data.category).match(/^[0-9a-fA-F]{24}$/)) {
            post.category = data.category;
          } else {
            let cat = await Category.findOne({ slug: data.category }).select(
              "_id"
            );
            if (!cat) {
              const created = await Category.create({
                name: slugToName(data.category),
                slug: data.category,
              });
              cat = { _id: created._id };
            }
            post.category = cat ? cat._id : null;
          }
        } else {
          post.category = null;
        }
      }
      // tags update
      if (Array.isArray(data.tags)) {
        const tagNames = data.tags.map((t) => String(t).toLowerCase());
        const existing = await Tag.find({ name: { $in: tagNames } });
        const existingMap = new Map(existing.map((t) => [t.name, t]));
        for (const name of tagNames) {
          if (!existingMap.has(name)) {
            const created = await Tag.create({ name });
            existingMap.set(name, created);
          }
        }
        post.tags = Array.from(existingMap.values()).map((t) => t._id);
      }
      // Whitelist updatable fields
      const allowed = ["title", "excerpt", "content", "meta"];
      for (const k of allowed) {
        if (data[k] !== undefined) post[k] = data[k];
      }
      if (isAdmin) {
        if (typeof data.featured === "boolean") post.featured = data.featured;
        if (
          data.status &&
          ["draft", "submitted", "published", "archived"].includes(data.status)
        )
          post.status = data.status;
      } else {
        // Non-admin cannot publish directly
        if (data.status === "published") post.status = "submitted";
        // Ignore featured field from non-admins
      }
      await post.save();
      res.json(post);
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error updating post", error: err.message });
    }
  }
);

// Publish / Unpublish
function requireAdmin(req, res, next) {
  if (req.user.role !== "admin")
    return res.status(403).json({ message: "Admin only" });
  next();
}
router.post("/posts/:id/publish", auth, requireAdmin, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    post.status = "published";
    await post.save();
    res.json(post);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error publishing post", error: err.message });
  }
});
router.post("/posts/:id/unpublish", auth, requireAdmin, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    post.status = "draft";
    await post.save();
    res.json(post);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error unpublishing post", error: err.message });
  }
});

// Get posts (filtering)
router.get(
  "/posts",
  [
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 100 }),
    query("featured").optional().isBoolean().toBoolean(),
    query("category").optional().isString(),
    query("categories").optional().isString(),
    query("q").optional().isString().isLength({ max: 200 }),
    query("tags").optional().isString(),
    query("tagsMode").optional().isIn(["any", "all"]),
    query("postType").optional().isIn(["blog", "success"]),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });
      const { page, limit, skip } = getPagination(req);
      const {
        status,
        category,
        categories: multiCategories,
        tag,
        q,
        featured,
        postType,
        sort,
        tags,
        tagsMode,
      } = req.query;
      const filter = {};
      // Optional token to allow admin to query non-published content
      let isAdmin = false;
      const authHeader = req.header("Authorization");
      if (authHeader) {
        try {
          const jwt = require("jsonwebtoken");
          const decoded = jwt.verify(
            authHeader.replace("Bearer ", ""),
            process.env.JWT_SECRET
          );
          isAdmin = decoded.role === "admin";
        } catch (e) {
          /* ignore invalid token */
        }
      }
      if (status) {
        // If status explicitly requested, honor only if admin; else restrict to published
        if (isAdmin) {
          filter.status = status;
        } else {
          filter.status = "published";
        }
      } else {
        // No status param: admins get all except archived unless ?all=1; public only published
        if (isAdmin) {
          if (req.query.all === "1") {
            // do not constrain status (returns all)
          } else {
            filter.status = {
              $in: ["draft", "submitted", "published", "archived"],
            };
          }
        } else {
          filter.status = "published";
        }
      }
      if (typeof featured === "boolean") filter.featured = featured;
      // Single category (slug or id)
      if (category) {
        // Accept either a Mongo ObjectId or a slug string
        if (category.match && category.match(/^[0-9a-fA-F]{24}$/)) {
          filter.category = category;
        } else {
          try {
            const catDoc = await Category.findOne({ slug: category }).select(
              "_id"
            );
            if (catDoc) filter.category = catDoc._id;
            else filter.category = { $in: [] }; // force empty result if slug not found
          } catch (e) {
            filter.category = { $in: [] };
          }
        }
      }
      // Multi-categories: comma-separated list of slugs or ids (for backward compatibility)
      if (multiCategories) {
        const raw = String(multiCategories)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        const ids = raw.filter((v) => /^[0-9a-fA-F]{24}$/.test(v));
        const slugs = raw.filter((v) => !/^[0-9a-fA-F]{24}$/.test(v));
        let resolved = [];
        if (slugs.length) {
          const found = await Category.find({ slug: { $in: slugs } }).select(
            "_id"
          );
          resolved = found.map((c) => String(c._id));
        }
        const all = Array.from(new Set([...ids, ...resolved]));
        if (all.length) {
          filter.category = { $in: all };
        } else {
          filter.category = { $in: [] };
        }
      }
      if (tag) filter.tags = tag;
      if (postType) filter.postType = postType;
      if (q) {
        filter.$text = { $search: q };
      }
      // Multi-tag filter (names case-insensitive) ?tags=tag1,tag2
      if (tags) {
        const list = tags
          .split(",")
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean);
        if (list.length) {
          const tagDocs = await Tag.find({ name: { $in: list } }).select("_id");
          const ids = tagDocs.map((t) => t._id);
          if (ids.length) {
            filter.tags = tagsMode === "all" ? { $all: ids } : { $in: ids };
          } else {
            // Force empty result if no matching tag names
            filter.tags = { $in: [] };
          }
        }
      }
      let sortSpec = { publishedAt: -1, createdAt: -1 };
      if (sort === "views") sortSpec = { views: -1, publishedAt: -1 };

      const queryObj = Post.find(filter)
        .populate("author", "name profile")
        .populate("category", "name slug")
        .populate("tags", "name")
        .sort(sortSpec)
        .skip(skip)
        .limit(limit);

      const [items, total] = await Promise.all([
        queryObj,
        Post.countDocuments(filter),
      ]);

      res.json({ page, limit, total, pages: Math.ceil(total / limit), items });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Error fetching posts", error: err.message });
    }
  }
);

// Get single post by slug
// Public: published posts
// Authenticated owner or admin: can view own/unpublished post by slug
router.get("/posts/slug/:slug", async (req, res) => {
  try {
    let tokenUser = null;
    const authHeader = req.header("Authorization");
    if (authHeader) {
      try {
        const jwt = require("jsonwebtoken");
        tokenUser = jwt.verify(
          authHeader.replace("Bearer ", ""),
          process.env.JWT_SECRET
        );
      } catch (e) {
        /* ignore invalid token */
      }
    }
    const baseFilter = { slug: req.params.slug };
    if (!tokenUser) {
      baseFilter.status = "published";
    }
    const post = await Post.findOne(baseFilter)
      .populate("author", "name profile")
      .populate("category", "name slug")
      .populate("tags", "name");
    if (!post) return res.status(404).json({ message: "Post not found" });
    const isOwner = tokenUser && String(post.author._id) === tokenUser.userId;
    const isAdmin = tokenUser && tokenUser.role === "admin";
    if (post.status !== "published" && !isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not allowed" });
    }
    Post.updateOne({ _id: post._id }, { $inc: { views: 1 } }).exec();
    res.json(post);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching post", error: err.message });
  }
});

// Serve cover image by post id (fallback to placeholder when missing)
router.get("/posts/:id/cover", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).select(
      "coverImageData coverImageMime coverImage"
    );
    // If binary is stored in DB, serve it directly
    if (post && post.coverImageData) {
      res.setHeader("Content-Type", post.coverImageMime || "image/jpeg");
      res.setHeader("Cache-Control", "public, max-age=3600");
      return res.send(post.coverImageData);
    }
    // If there's a file path stored (e.g., from /uploads), try to serve it
    if (post && post.coverImage) {
      try {
        // If it's an absolute URL, redirect
        if (/^https?:\/\//i.test(post.coverImage)) {
          return res.redirect(post.coverImage);
        }
        // Otherwise assume it's an R2 key stored like 'uploads/...' and redirect to public URL
        try {
          const { getPublicUrl } = require('../config/r2');
          const publicUrl = getPublicUrl(post.coverImage);
          return res.redirect(publicUrl);
        } catch (e) {
          // If building public URL failed, fall back to local file serve
        }
        // Local path: stream if exists (legacy)
        const relPath = post.coverImage.startsWith("/")
          ? post.coverImage
          : `/${post.coverImage}`;
        const filePath = path.join(__dirname, "..", relPath);
        if (fs.existsSync(filePath)) {
          return res.sendFile(filePath);
        }
        const uploadsTry = path.join(
          __dirname,
          "..",
          "uploads",
          post.coverImage.replace(/^.*\//, "")
        );
        if (fs.existsSync(uploadsTry)) {
          return res.sendFile(uploadsTry);
        }
      } catch (e) {
        /* fall through to placeholder */
      }
    }
    // Fallback: 1x1 transparent PNG placeholder
    const png =
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9WmK+S8AAAAASUVORK5CYII=";
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "public, max-age=300");
    return res.send(Buffer.from(png, "base64"));
  } catch (err) {
    res.status(500).json({ message: "Error fetching cover image" });
  }
});

// Get single post by id (drafts allowed for owner)
router.get("/posts/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "name profile")
      .populate("category", "name slug")
      .populate("tags", "name");
    if (!post) return res.status(404).json({ message: "Post not found" });
    const isOwner = String(post.author._id) === req.user.userId;
    const isAdmin = req.user.role === "admin";
    if (post.status !== "published" && !isOwner && !isAdmin) {
      return res.status(403).json({ message: "Not allowed" });
    }
    res.json(post);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching post", error: err.message });
  }
});

// Delete post
router.delete("/posts/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    const isOwner = String(post.author) === req.user.userId;
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin)
      return res.status(403).json({ message: "Not allowed" });

    // Attempt to remove any local cover image file if present and local
    if (post.coverImage) {
      // If coverImage is an absolute URL, nothing to delete locally
      if (!/^https?:\/\//i.test(post.coverImage)) {
        // Assume it's an R2 key - attempt to delete from R2
        try {
          const { deleteObjectFromR2 } = require('../config/r2');
          await deleteObjectFromR2({ Key: post.coverImage });
        } catch (e) {
          // If deletion fails, attempt legacy local file delete
          try {
            const relPath = post.coverImage.startsWith("/")
              ? post.coverImage
              : `/${post.coverImage}`;
            const filePath = path.join(__dirname, "..", relPath);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            else {
              const uploadsTry = path.join(
                __dirname,
                "..",
                "uploads",
                post.coverImage.replace(/^.*\//, "")
              );
              if (fs.existsSync(uploadsTry)) fs.unlinkSync(uploadsTry);
            }
          } catch (e2) {
            /* ignore fs errors */
          }
        }
      }
    }

    await Post.deleteOne({ _id: post._id });
    res.json({ message: "Deleted", id: String(post._id) });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting post", error: err.message });
  }
});

// List current user's posts (any status)
router.get("/posts/mine", auth, async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user.userId })
      .sort({ createdAt: -1 })
      .populate("category", "name slug")
      .populate("tags", "name");
    res.json(posts);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching user posts", error: err.message });
  }
});

module.exports = router;
