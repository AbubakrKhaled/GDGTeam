const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;
const User = require('./User.js');


const customerSchema = new Schema({
    gender:{
        type: String,
        required: [true, 'Please choose your gender'],
        enum: ['Male', 'Female']
    },
    addresses: [{
        label: { type: String, required: true }, 
        line1: { type: String, required: true },
        city: { type: String, required: true },
        governorate: { type: String, required: true },
        zip: { type: String },
        isDefault: { type: Boolean, default: false }
    }, { _id: false }
    ],
    wishlist: [{
        type: Types.ObjectId,
        ref: 'product'
    }],
    isActive:{
        type: Boolean,
        default: false
    }
}, { timestamps: true }
);

const customer = User.discriminator('customer', customerSchema);

module.exports = customer