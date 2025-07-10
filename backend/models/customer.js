// complete this file
const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;

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

const customer = User.discriminator('customer', customerSchema);

const passwordHashing = require('../middlewares/hashPassword');
customer.schema.pre('save', passwordHashing);

module.exports = customer