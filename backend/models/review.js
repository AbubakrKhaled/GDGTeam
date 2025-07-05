const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const reviewSchema = new Schema({
  customer: {
    type: Types.ObjectId,
    ref: 'Customer',
    required: true
  },
  product: {
    type: Types.ObjectId,
    ref: 'Product'
  },
  brand: {
    type: Types.ObjectId,
    ref: 'Brand'
  },
  stars: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  description: {
    type: String,
    maxlength: 1000
  }
}, {timestamps: true}
);

reviewSchema.index(
  { customer: 1, product: 1 },
  { unique: true, partialFilterExpression: { product: { $exists: true } } }
);
reviewSchema.index(
  { customer: 1, brand: 1 },
  { unique: true, partialFilterExpression: { brand: { $exists: true } } }
);

module.exports = mongoose.model('review', reviewSchema);
