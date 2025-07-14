const mongoose = require('mongoose');
const { Schema, model, Types } = mongoose;

const reviewSchema = new Schema({
    customerId: {
        type: Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    refType: {
        type: String,
        required: true,
        enum: ['Product', 'Brand']
    },
    refId: {
        type: Types.ObjectId,
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        trim: true,
        maxlength: 1000
    },
}, { timestamps: true }
);

reviewSchema.index({ customerId: 1, refType: 1, refId: 1 }, { unique: true });

module.exports = model('Review', reviewSchema);
