const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;

const ratingsSchema = new Schema({
  customer: {
    type: Types.ObjectId,
    ref: 'customer',
    required: true
  },
  product: {
    type: Types.ObjectId,
    ref: 'product'
  },
  brand: {
    type: Types.ObjectId,
    ref: 'brand'
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

ratingsSchema.index(
  { customer: 1, product: 1 },
  { unique: true, partialFilterExpression: { product: { $exists: true } } }
);
ratingsSchema.index(
  { customer: 1, brand: 1 },
  { unique: true, partialFilterExpression: { brand: { $exists: true } } }
);

module.exports = mongoose.model('ratings', ratingsSchema);
