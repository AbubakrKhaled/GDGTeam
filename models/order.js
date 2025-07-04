const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customer',
        required: [true]
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'product'
            },
            quantity: {
                type: Number,
                required: [true]
            }
        }
    ],
    totalPrice: {
        type: Number,
        required: [true]
    },
    deliveryAddress: {
        type: String,
        required: [true]
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
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})