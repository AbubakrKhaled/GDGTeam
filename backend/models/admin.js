// remove this Schema
const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const User = require('./User.js');


const adminSchema = new Schema({
    adminlevel: {
        type: String,
        enum: ['Root', 'Moderator', 'Support'],
        default: 'Support',
        required: [true, 'Please assign a role']
    },
}, { timestamps: true }
);


const passwordHashing = require('../middlewares/hashPassword');
adminSchema.pre('save', passwordHashing);

const admin = User.discriminator('admin', adminSchema);
  
module.exports = admin
