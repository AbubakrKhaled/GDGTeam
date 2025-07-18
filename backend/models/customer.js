const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;
const User = require('./User.js');

const customerSchema = new Schema({
    gender: {
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
    }],
    wishlist: [{
        type: Types.ObjectId,
        ref: 'Product'
    }],
    cart: [{
<<<<<<< HEAD
        product: {type: Types.ObjectId, ref: 'product'},
        quantity: {type: Number}    
=======
        product: { 
            type: Types.ObjectId, 
            ref: 'Product' 
        },
        quantity: {
            type: Number,
            default: 1,
            min: 1
        }
>>>>>>> 6f7eec4 (i updated the frontend)
    }],
    discountCode: {
        type: String,
        default: null
    },
    isActive: {
        type: Boolean,
        default: false
<<<<<<< HEAD
    },
    loyaltyPoints: { type: Number, default: 0 }
}, { timestamps: true }
);
=======
    }
}, { timestamps: true });
>>>>>>> 6f7eec4 (i updated the frontend)

const Customer = User.discriminator('Customer', customerSchema);
module.exports = Customer;