// complete this file
const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;
const customerSchema = new Schema(
{
    customername:{
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
    phonenumber:{
        type: String,
        required: [true, 'Please add phone number']
    },
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
      },
      { _id: false }
  ],
  wishlist: [
    {
      type: Types.ObjectId,
      ref: 'ProductVariant'
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true }
);

//Password Hashing
const passwordHashing = require('../middlewares/hashPassword');
customerSchema.pre('save', passwordHashing);

module.exports = mongoose.model('customer', customerSchema);