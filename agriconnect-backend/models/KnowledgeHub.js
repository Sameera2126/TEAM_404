const mongoose = require('mongoose');

const knowledgeHubSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    type: {
        type: String,
        enum: ['article', 'video', 'guide'],
        required: true
    },
    content: {
        type: String,
        required: [true, 'Content is required']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true
    },
    videoUrl: {
        type: String
    },
    language: {
        type: String,
        enum: ['en', 'hi', 'ta', 'te'],
        default: 'en'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tags: [{
        type: String,
        trim: true
    }]
}, {
    timestamps: true
});

// Indexes for better search performance
knowledgeHubSchema.index({ title: 'text', content: 'text', tags: 'text' });
knowledgeHubSchema.index({ type: 1, category: 1, language: 1 });
knowledgeHubSchema.index({ createdAt: -1 });

module.exports = mongoose.model('KnowledgeHub', knowledgeHubSchema);
