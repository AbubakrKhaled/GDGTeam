const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;

const orderSchema = new Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customer',
        required: true
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'product'
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ],
    // this become brand not brands
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'brand'
    },
    totalPrice: {
        type: Number,
        required: true
    },
    deliveryAddress: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        required: [true, 'Please choose accepted payment methods'],
        enum: ['Instapay', 'Vodafone Cash']
    },
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        //pending=while we send order to business. processing=business making order. shipped=business shipping.
        default: 'Pending'
    }
}, { timestamps: true }
)

module.exports = mongoose.model('order', orderSchema);