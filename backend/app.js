const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// CORS Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  ...((process.env.ADDITIONAL_ORIGINS || '').split(',').map(s=> s.trim()).filter(Boolean))
];
app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true); // allow non-browser tools
    if(allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

// Security headers
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

// Behind proxies (e.g., Vercel/Render/Heroku)
app.set('trust proxy', 1);

// Basic rate limiting (skip heavy image proxy endpoint)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX || 1200),
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    const url = req.originalUrl || req.url || '';
    return /\/api\/blog\/posts\/[0-9a-fA-F]{24}\/cover(?:\?|$)/.test(url);
  }
});
app.use('/api/', apiLimiter);

// Tighter limits for auth endpoints
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 50, standardHeaders: true, legacyHeaders: false });
app.use(['/api/auth/login','/api/auth/register','/api/auth/firebase'], authLimiter);

// Sanitize inputs against NoSQL injection
app.use(mongoSanitize());

// Middleware (increase JSON limit for base64 image payloads)
const JSON_LIMIT = process.env.JSON_BODY_LIMIT || '5mb';
app.use(express.json({ limit: JSON_LIMIT }));

// MongoDB Connection (connect lazily when first needed by handlers)
const MONGODB_URI = process.env.MONGODB_URI;
if(!process.env.JWT_SECRET){
  console.error('Missing JWT_SECRET - refusing to start.');
  // On Vercel, exporting the app without process exit allows build to succeed but runtime will fail early.
}
let mongoReady = false;
async function ensureMongo(){
  if(mongoReady) return;
  try {
    await mongoose.connect(MONGODB_URI);
    mongoReady = true;
    console.log('MongoDB connected');
  } catch(err){
    console.error('MongoDB connection error:', err);
    throw err;
  }
}

// Ensure connection for all API routes
app.use(async (req,res,next)=>{
  try { await ensureMongo(); next(); } catch(err){ res.status(500).json({ message:'Database unavailable' }); }
});

// Base API path configurable
const API_BASE = process.env.API_BASE_PATH || '/api';

// Routes
const authRoutes = require("./routes/auth");
app.use(`${API_BASE}/auth`, authRoutes);

const blogRoutes = require('./routes/blog');
app.use(`${API_BASE}/blog`, blogRoutes);

const applicationRoutes = require('./routes/applications');
app.use(`${API_BASE}/applications`, applicationRoutes);

const consultationRoutes = require('./routes/consultations');
app.use(`${API_BASE}/consultations`, consultationRoutes);

const menteeRoutes = require('./routes/mentees');
app.use(`${API_BASE}/mentees`, menteeRoutes);

// Uploads to Vercel Blob
const uploadRoutes = require('./routes/uploads');
app.use(`${API_BASE}/uploads`, uploadRoutes);

// Static file serving for uploaded images (no-op on Vercel; prefer external storage like Vercel Blob)
app.use('/uploads', express.static(path.join(__dirname,'uploads')));

module.exports = app;
