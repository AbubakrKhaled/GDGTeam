const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const adminSchema = new mongoose.Schema({
    username:{
        type: String,
        required: [true, 'Please add a name']
    },
    password:{
        type: String,
        required: [true, 'Please add a password'],
        minlength: 10,
        select: false
    },
    role:{
        type: String,
        enum: ['admin'],
        default: 'admin'
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

//Password Hashing
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});


module.exports = mongoose.model('admin', adminSchema);