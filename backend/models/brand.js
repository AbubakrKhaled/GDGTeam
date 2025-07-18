const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;
const User = require('./User');
const {brand_categories} = require('../core/constants.js');

const brandSchema = new Schema({
    categories:{
        type: [String],
        enum: brand_categories,        
        required: [true, 'Please add categories of all products']
    },
    socialMedia: {
        facebook: String,
        instagram: String,
        twitter: String
    },
    locations: [{
        address: String,
        city: String,
        governorate: String,
        zip: String
    }],
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
    reviews: [{
        type: Types.ObjectId,
        ref: 'Review'
    }],
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    isActive:{
        type: Boolean,
        default: false
    },
}, { timestamps: true });

const Brand = User.discriminator('Brand', brandSchema);
module.exports = Brand;