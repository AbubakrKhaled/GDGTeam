const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const productSchema = new Schema({
    brand: {
        type: Types.ObjectId,
        ref: 'brand',
        required: [true]
    },
    productname: {
        type: String,
        required: [type]
    },
    price: {
        type: Number,
        required: [type]
    },
    quantity: {
        type: Number,
        required: [type]
    },
    imageURL: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    },
    category: {
        type: Types.ObjectId,
        ref: 'category',
        required: true
    },
    color: {
        type: Types.ObjectId,
        ref: 'color',
        required: true
    },
    size: {
        type: Types.ObjectId,
        ref: 'size',
        required: true
    },
    discount: {
        type: Types.ObjectId,
        ref: 'discount'
    },
    reviews: {
        type: Types.ObjectId,
        ref: 'ratings'
    }    

}, { timestamps: true }
)

module.exports = mongoose.model('product', productSchema);