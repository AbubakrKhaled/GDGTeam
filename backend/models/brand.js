const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Schema, model, Types } = mongoose;
const User = require('./User');
const {brand_categories} = require('../core/constants.js')

const brandSchema = new Schema({
    // what if we needed to add more categories?// why this is an enum?(This filed should not be fixed, it should be flexible to add more categories in the future)
    categories:{
        type: [String],
        enum: {values: brand_categories},        
        required: [true, 'Please add categories of all products']
    },
    page:{
        type: [String],
        required: [true, 'Please add all social media pages']
    },
    brandlocation:{
        type: [String],
        required: false
    },
    logoURL:{
        type: String,
        required: false
    },
    deliveryTime:{
        type: String,
        required: false
    },
    description:{
        type: String,
        required: false,
        maxlength: 500
    },
    isApproved:{
        type: Boolean,
        default: false
    },
    reviews:{
        type: Types.ObjectId,
        ref: 'Review'
    },
    products:[{
        type: Types.ObjectId,
        ref: 'product'
    }],
    isActive:{
        type: Boolean,
        default: false
    },
}, { timestamps: true }
);

// this will be in signup and login and update profile as we said in the last session (Apply to all)
const passwordHashing = require('../middlewares/hashPassword');
brandSchema.pre('save', passwordHashing);

const brand = User.discriminator('brand', brandSchema);

module.exports = brand;