const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;
const User = require('./User.js');

// where is the cart
const customerSchema = new Schema({
    gender:{
        type: String,
        required: [true, 'Please choose your gender'],
        enum: ['Male', 'Female']
    },/*
    // simplify this add this as an array of strings
    addresses: [{
        label: { type: String, required: true }, 
        line1: { type: String, required: true },
        city: { type: String, required: true },
        governorate: { type: String, required: true },
        zip: { type: String },
        isDefault: { type: Boolean, default: false }
    }, { _id: false }
    ],*/
    address: {
        types: String,
        required: true
    },
    wishlist: [{
        type: Types.ObjectId,
        ref: 'product'
    }],
    cart: [{
        type: Types.ObjectId,
        ref: 'product'
    }],
    isActive:{
        type: Boolean,
        default: false
    },
    loyaltyPoints: { type: Number, default: 0 }
}, { timestamps: true }
);

const customer = User.discriminator('customer', customerSchema);

module.exports = customer