const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { body, validationResult } = require('express-validator');
const User = require("../models/User");
const auth = require("../middleware/auth");
// Correct relative path (routes -> backend root)
const admin = require("../firebaseAdmin");

// Register new user
router.post(
	"/register",
	[
		body('name').trim().isLength({ min: 2, max: 80 }).withMessage('Name 2-80 chars'),
		body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
		body('password').isLength({ min: 8 }).withMessage('Password min 8 chars'),
		body('profile').optional().isObject().withMessage('Profile must be object')
	],
	async (req, res) => {
	try {
		const errors = validationResult(req);
		if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
		const { name, email, password, profile } = req.body;

		// Check if user already exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ message: "User already exists" });
		}

		// Create new user
		const user = new User({
			name,
			email,
			password,
			profile,
		});

		await user.save();

		// Generate JWT token including role
		const token = jwt.sign(
			{ userId: user._id, role: user.role },
			process.env.JWT_SECRET,
			{ expiresIn: "24h" }
		);

		res.status(201).json({
			message: "User created successfully",
			token,
			user: {
				id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
				profile: user.profile,
			},
		});
	} catch (error) {
		console.error("Registration error:", error);
		res
			.status(500)
			.json({ message: "Error creating user", error: error.message });
	}
});

// Login user
router.post(
	"/login",
	[
		body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
		body('password').isString().isLength({ min: 1 }).withMessage('Password required')
	],
	async (req, res) => {
	try {
		const errors = validationResult(req);
		if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
		const { email, password } = req.body;

		// Find user
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		// Check password
		const isMatch = await user.comparePassword(password);
		if (!isMatch) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		// Update last login
		user.lastLogin = new Date();
		await user.save();

		// Generate JWT token including role
		const token = jwt.sign(
			{ userId: user._id, role: user.role },
			process.env.JWT_SECRET,
			{ expiresIn: "24h" }
		);

		res.json({
			token,
			user: {
				id: user._id,
				username: user.username,
				email: user.email,
				role: user.role,
				profile: user.profile,
			},
		});
	} catch (error) {
		res.status(500).json({ message: "Error logging in", error: error.message });
	}
});

// Get user profile (protected route)
router.get("/profile", auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.userId).select("-password");
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		res.json(user);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error fetching profile", error: error.message });
	}
});

// Update user profile (protected route)
router.put("/profile", auth, async (req, res) => {
	try {
		// Only allow updating profile object fields; limit size
		const incoming = req.body || {};
		const allowed = ['avatar','bio','location','links'];
		const safeProfile = {};
		if(incoming && typeof incoming === 'object'){
			for(const k of allowed){ if(incoming[k] !== undefined) safeProfile[k] = incoming[k]; }
		}
		const user = await User.findByIdAndUpdate(
			req.user.userId,
			{ $set: { profile: safeProfile } },
			{ new: true }
		).select("-password");

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		res.json(user);
	} catch (error) {
		res
			.status(500)
			.json({ message: "Error updating profile", error: error.message });
	}
});

// Firebase token exchange
router.post('/firebase', async (req,res)=>{
	try {
		const { idToken } = req.body;
		if(!idToken) return res.status(400).json({ message:'idToken required'});
		// Ensure Firebase Admin actually initialized
		if(!admin.apps.length) return res.status(500).json({ message:'Firebase Admin not initialized (missing credentials)'});
		const decoded = await admin.auth().verifyIdToken(idToken);
		const email = decoded.email;
		if(!email) return res.status(400).json({ message:'No email in Firebase token'});
		let user = await User.findOne({ email });
			if(!user){
				user = await User.create({
					name: decoded.name || email.split('@')[0],
					email,
					password: Math.random().toString(36).slice(-12),
					role: 'user',
					profile: { avatar: decoded.picture },
					firebaseUid: decoded.uid || decoded.user_id
				});
			} else if(!user.firebaseUid && (decoded.uid || decoded.user_id)) {
				user.firebaseUid = decoded.uid || decoded.user_id;
				await user.save();
			}
		const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
		res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, profile: user.profile } });
	} catch(err){
		console.error('Firebase exchange error', err);
		res.status(500).json({ message:'Firebase auth exchange failed', error: err.message });
	}
});

// Refresh token to capture updated role after promotion
router.post('/refresh-token', auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.userId);
		if(!user) return res.status(404).json({ message:'User not found'});
		const token = jwt.sign(
			{ userId: user._id, role: user.role },
			process.env.JWT_SECRET,
			{ expiresIn: '24h' }
		);
		res.json({ token, role: user.role });
	} catch(err){
		console.error('Refresh token error', err);
		res.status(500).json({ message:'Could not refresh token' });
	}
});

module.exports = router;
