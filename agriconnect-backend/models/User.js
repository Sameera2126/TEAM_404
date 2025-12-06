const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
        trim: true
    },
    phone: {
        type: String,
        required: [true, 'Please enter your phone number'],
        unique: true,
        trim: true
    },
    role: {
        type: String,
        enum: ['farmer', 'expert', 'government'],
        default: 'farmer'
    },
    language: {
        type: String,
        enum: ['en', 'hi', 'ta', 'te'],
        default: 'en'
    },
    avatar: {
        type: String,
        default: ''
    },
    location: {
        district: String,
        state: String
    },
    crops: [{
        type: String,
        trim: true
    }],
    experienceLevel: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        default: 'Beginner'
    },
    verificationStatus: {
        type: String,
        enum: ['pending', 'verified'],
        default: 'pending'
    }
}, {
    timestamps: true
});

// Index for faster querying
userSchema.index({ phone: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'location.state': 1, 'location.district': 1 });

module.exports = mongoose.model('User', userSchema);
