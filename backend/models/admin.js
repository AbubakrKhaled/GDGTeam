const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const User = require('./User.js');


const adminSchema = new Schema({
    role: {
        type: String,
        enum: ['Root', 'Moderator', 'Support'],
        default: 'Support',
        required: [true, 'Please assign a role']
    },
}, { timestamps: true }
);

const admin = User.discriminator('admin', adminSchema);

const passwordHashing = require('../middlewares/hashPassword');
admin.schema.pre('save', passwordHashing);
  
module.exports = admin
