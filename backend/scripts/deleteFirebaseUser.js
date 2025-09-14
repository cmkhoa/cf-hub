#!/usr/bin/env node
/**
 * Delete a user created via Firebase login (both Mongo record and optionally Firebase auth user)
 * Usage:
 *  node backend/scripts/deleteFirebaseUser.js --email user@example.com [--firebase] 
 *  or by firebase uid:
 *  node backend/scripts/deleteFirebaseUser.js --uid FIREBASE_UID [--firebase]
 */
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const admin = require('../../firebaseAdmin');

dotenv.config({ path: path.join(__dirname,'..','.env') });

async function run(){
  const args = process.argv.slice(2);
  const emailFlag = args.indexOf('--email');
  const uidFlag = args.indexOf('--uid');
  const doFirebase = args.includes('--firebase');
  const email = emailFlag>=0 ? args[emailFlag+1] : null;
  const uid = uidFlag>=0 ? args[uidFlag+1] : null;
  if(!email && !uid){
    console.error('Provide --email or --uid');
    process.exit(1);
  }
  const uri = process.env.MONGODB_URI;
  if(!uri){
    console.error('MONGODB_URI missing');
    process.exit(1);
  }
  await mongoose.connect(uri, { useNewUrlParser:true, useUnifiedTopology:true });
  let user;
  if(email){ user = await User.findOne({ email }); }
  if(!user && uid){ user = await User.findOne({ firebaseUid: uid }); }
  if(!user){
    console.log('No matching user found');
    process.exit(0);
  }
  console.log('Deleting Mongo user:', user.email, user._id.toString());
  await user.deleteOne();
  if(doFirebase){
    if(admin?.auth){
      try {
        const targetUid = uid || user.firebaseUid;
        if(targetUid){
          await admin.auth().deleteUser(targetUid);
          console.log('Deleted Firebase auth user:', targetUid);
        } else {
          console.log('No firebaseUid stored; skipped Firebase auth deletion');
        }
      } catch(e){ console.warn('Firebase deletion failed:', e.message); }
    } else {
      console.log('Firebase Admin not initialized; skipped Firebase auth deletion');
    }
  }
  await mongoose.disconnect();
  console.log('Done.');
}
run().catch(err=>{ console.error(err); process.exit(1); });
