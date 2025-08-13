const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;

const productSchema = new Schema({
    brand: {
        type: Types.ObjectId,
        ref: 'brand',
        required: true
    },
    productname: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 0
    },
    // Handle both single image and multiple images
    imageURL: {
        type: [String],
        required: false,
        default: []
    },
    description: {
        type: String,
        required: false,
        default: ''
    },
    category: {
        type: Types.ObjectId,
        ref: 'category',
        required: true
    },
    color: {
        type: String,
        required: true,
    },
    size: {
        type: Types.ObjectId,
        ref: 'size',
        required: false
    },// dont refrence (amount ,is valid)
    discountAmount: { 
        type: Number, 
        default: 0, 
        min: 0 
    },
    isDiscountValid: { 
        type: Boolean, 
        default: false 
    },
    reviews: {
        type: Types.ObjectId,
        ref: 'reviews',
        required: false
    },
    isActive:{
        type: Boolean,
        default: true,
        select: false
    }
}, { timestamps: true }
)

module.exports = mongoose.model('product', productSchema);