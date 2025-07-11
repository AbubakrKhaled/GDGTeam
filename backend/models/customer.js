const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;
const User = require('./User.js');


const customerSchema = new Schema({
    gender:{
        type: String,
        required: [true, 'Please choose your gender'],
        enum: ['Male', 'Female']
    },
    addresses: [
    {
        label: { type: String, required: true }, 
        line1: { type: String, required: true },
        city: { type: String, required: true },
        governorate: { type: String, required: true },
        zip: { type: String },
        isDefault: { type: Boolean, default: false }
    }, { _id: false }
    ],
    wishlist: [
    {
      type: Types.ObjectId,
      ref: 'product'
    }
    ],
}, { timestamps: true }
);
// this will be in signup and login and update profile as we saied in last session (Apply to all)
const passwordHashing = require('../middlewares/hashPassword');
customerSchema.pre('save', passwordHashing);

const customer = User.discriminator('customer', customerSchema);

module.exports = customer