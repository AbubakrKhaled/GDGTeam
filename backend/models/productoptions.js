const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;
const {colors} = require('../core/constants.js')

const categorySchema = new Schema({
  category: {
    type: String,
    required: [true, 'Please enter category']
  }
});

const sizeSchema = new Schema({
  size: {
    type: String,
    required: [true, 'Please enter product size']
  },
});


module.exports = {
  Category: model('category', categorySchema),
  Size: model('size', sizeSchema)
};
