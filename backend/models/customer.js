const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;
const User = require('./User.js');

const customerSchema = new Schema({
    address: {
        type: String,
        required: true
    },
    gender:{
        type: String,
        required: true
    },
    wishlist: [{
        type: Types.ObjectId,
        ref: 'product'
    }],
    cart: [{
        product: { 
            type: Types.ObjectId, 
            ref: 'product' 
        },
        quantity: {
            type: Number,
            default: 1,
            min: 1
        }
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    /*loyaltyPoints: { 
        type: Number, 
        default: 0 
    }*/
}, { timestamps: true }
);


const Customer = User.discriminator('customer', customerSchema);
module.exports = Customer;