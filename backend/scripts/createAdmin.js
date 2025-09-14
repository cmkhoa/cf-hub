#!/usr/bin/env node
/**
 * Usage: node scripts/createAdmin.js userEmail@example.com
 * Promotes an existing user to admin (or creates if not exists when --create flag is passed)
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');

async function run(){
  const email = process.argv[2];
  const createIfMissing = process.argv.includes('--create');
  if(!email){
    console.error('Email required. Example: node scripts/createAdmin.js user@example.com --create');
    process.exit(1);
  }
  const uri = process.env.MONGODB_URI;
  if(!uri){
    console.error('MONGODB_URI missing in environment');
    process.exit(1);
  }
  await mongoose.connect(uri, { useNewUrlParser:true, useUnifiedTopology:true });
  let user = await User.findOne({ email });
  if(!user){
    if(!createIfMissing){
      console.error('User not found. Add --create to create a new admin user.');
      process.exit(1);
    }
    user = new User({ name: email.split('@')[0], email, password: Math.random().toString(36).slice(-10), role:'admin' });
    await user.save();
    console.log('Created new admin user:', user.email);
  } else {
    user.role = 'admin';
    await user.save();
    console.log('Updated user to admin:', user.email);
  }
  await mongoose.disconnect();
  console.log('Done.');
}

run().catch(err=>{ console.error(err); process.exit(1); });
