const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;
const colors = require('../core/constants.js')

const categorySchema = new Schema({
  category: {
    type: String,
    required: [true, 'Please enter category']
  }
});

/*const colorSchema = new Schema({
  color: {
    type: String,
    required: [true, 'Please enter product color']
  },
  hex: String
});*/

const colorSchema = new Schema({
  color:{
    type: String,
    required: [true, 'Please enter product color']
  },
  enum: {values: colors}
})

const sizeSchema = new Schema({
  size: {
    type: String,
    required: [true, 'Please enter product size']
  },
});

const discountSchema = new Schema({
  type: {
    type: String,
    enum: ['percentage', 'flat'],
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  validFrom: Date,
  validTo: Date,
  targets: [
    {
      brand: { type: Types.ObjectId, ref: 'brand' },
      product: { type: Types.ObjectId, ref: 'product' }
    }
  ]
});


module.exports = {
  Category: model('category', categorySchema),
  Color: model('color', colorSchema),
  Size: model('size', sizeSchema),
  Discount: model('discount', discountSchema)
};
