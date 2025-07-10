const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const User = require('./User.js');


const adminSchema = new Schema({
    
      role: {
        type: String,
        enum: ['ROOT', 'MODERATOR', 'SUPPORT'],
        default: 'MODERATOR',
        required: [true, 'Please assign a role']
      },
     
  }, { timestamps: true }
  );
  
  // Password Hashing 
  const passwordHashing = require('../middlewares/hashPassword');
  adminSchema.pre('save', passwordHashing);
  
  module.exports = model('Admin', adminSchema);
