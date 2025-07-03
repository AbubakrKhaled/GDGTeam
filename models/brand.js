const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const brandSchema = new mongoose.Schema({
    brandname:{
        type: String,
        required: [true, 'Please add a name']
    },
    email:{
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password:{
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    categories:{
        type: [String],
        enum: ['Clothes', 'Food', 'Skincare', 'Technology'],
        required: [true, 'Please add categories of all products']
    },
    phonenumber:{
        type: String,
        required: [true, 'Please add phone number']
    },
    page:{
        type: [String],
        required: [true, 'Please add all social media pages']
    },
    brandlocation:{
        type: [String],
        required: [false]
    },
    logoURL:{
        type: String,
        required: [false]
    },
    deliveryTime:{
        type: String,
        required: [false]
    },
    payment:{
        type: [String],
        required: [true, 'Please choose accepted payment methods'],
        enum: ['Instapay', 'Vodafone Cash', 'Cash on delivery']
    },
    description:{
        type: String,
        required: [false],
        maxlength: 500
    },
    isApproved:{
        type: Boolean,
        default: false
    },
    ratings:{
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    products:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products'
    }],
    role:{
        type: String,
        enum: ['admin', 'brand', 'customer'],
        default: 'brand'
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('brand', brandSchema);