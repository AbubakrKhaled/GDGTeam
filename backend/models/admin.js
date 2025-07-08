const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const adminSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Please add a username'],
      unique: true,
      minlength: 3
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          'Please add a valid email'
        ]
      },
      password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
      },
      role: {
        type: String,
        enum: ['ROOT', 'MODERATOR', 'SUPPORT'],
        default: 'MODERATOR',
        required: [true, 'Please assign a role']
      },
      phone: {
        type: String,
        required: false
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    },
    {
      timestamps: true
    }
  );
  
  // Password Hashing 
  const passwordHashing = require('../middlewares/hashPassword');
  adminSchema.pre('save', passwordHashing);
  
  module.exports = model('Admin', adminSchema);
