const mongoose = require('mongoose');

const askExpertSchema = new mongoose.Schema({
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    expert: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    cropType: {
        type: String,
        required: [true, 'Crop type is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    images: [{
        type: String
    }],
    status: {
        type: String,
        enum: ['pending', 'assigned', 'answered', 'closed'],
        default: 'pending'
    },
    answer: {
        type: String
    }
}, {
    timestamps: true
});

// Indexes for better query performance
askExpertSchema.index({ farmer: 1 });
askExpertSchema.index({ expert: 1 });
askExpertSchema.index({ status: 1 });
askExpertSchema.index({ createdAt: -1 });

module.exports = mongoose.model('AskExpert', askExpertSchema);
