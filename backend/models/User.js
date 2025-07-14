const mongoose = require('mongoose');
const { Schema } = mongoose;

// here add field called Role make it ['admin', 'customer', 'brand']
// and remove admin table because we dont need any information except what in User table
const BaseUserSchema = new Schema(
  {
    name:{
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
        type: Number,
        required: [true, 'Please add phone number']
    },
      role: {
          type: String,
          enum: ['admin', 'customer', 'brand'],
          required: [true, 'Please specify a role']
      }
  },
  { discriminatorKey: 'role', timestamps: true }
);

const User = mongoose.model('User', BaseUserSchema);

module.exports = User;
