import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String
    },
    fileUrl: {
        type: String
    },
    voiceMessageUrl: {
        type: String
    },
    seen: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const chatSchema = new mongoose.Schema({
    participants: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }],
        validate: [arrayLimit, 'Chat must have exactly 2 participants']
    },
    messages: [messageSchema],
    // lastMessage: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Message'
    // }
}, {
    timestamps: true
});

// Custom validator to ensure exactly 2 participants
function arrayLimit(val) {
    return val.length === 2;
}

// Index for faster participant lookup
chatSchema.index({ participants: 1 });
chatSchema.index({ 'messages.sender': 1 });
chatSchema.index({ updatedAt: -1 });

export default mongoose.model('Chat', chatSchema);
