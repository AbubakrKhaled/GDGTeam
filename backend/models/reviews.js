const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;

// Subschema for detailed rating breakdown
const ratingsSchema = new Schema(
  {
    overall: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    quality: {
      type: Number,
      min: 1,
      max: 5
    },
    comfort: {
      type: Number,
      min: 1,
      max: 5
    },
    fit: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  { _id: false } 
);

const reviewSchema = new Schema(
  {
    customerId: {
      type: Types.ObjectId,
      ref: 'Customer',
      required: true
    },
    productId: {
      type: Types.ObjectId,
      ref: 'Product',
      required: true
    },
    ratings: {
      type: ratingsSchema,
      required: true
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 1000
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// Prevent duplicate reviews (one per customer per product)
reviewSchema.index({ customerId: 1, productId: 1 }, { unique: true });

// For sorting/filtering reviews on a product
reviewSchema.index({ productId: 1, createdAt: -1 });

module.exports = model('Review', reviewSchema);
