const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;
const User = require('./User');
const {brand_categories} = require('../core/constants.js');

const brandSchema = new Schema({
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
        type: [String],
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
        default: true,
    },
    reviews: [{
        type: Types.ObjectId,
        ref: 'reviews'
    }],
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    isActive:{
        type: Boolean,
        default: true,
        select: false
    },
}, { timestamps: true });

const Brand = User.discriminator('brand', brandSchema);
module.exports = Brand;