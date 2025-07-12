const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const User = require('./User.js');


const adminSchema = new Schema({
    
}, { timestamps: true }
);

const admin = User.discriminator('admin', adminSchema);
  
module.exports = admin
