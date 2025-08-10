const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    token: { 
        type: String, 
        required: true 
    },
    refreshToken: {
        type: String
    },
    blackListedToken: { 
        type: Boolean, 
        default: false 
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'userType'
    },
    userType: {
        type: String,
        required: true,
        enum: ['admin', 'brand', 'customer']
    },
    createdAt: { 
        type: Date, 
        default: Date.now, 
        expires: '7d' 
    }
});

module.exports = mongoose.model('Token', tokenSchema);