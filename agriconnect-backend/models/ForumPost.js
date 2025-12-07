// models/ForumPost.js
import mongoose from 'mongoose';

const forumPostSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    content: {
        type: String,
        required: [true, 'Content is required']
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    category: {
        type: String,
        enum: ['Crop Disease', 'Pest Control', 'Organic Farming', 'Irrigation', 'Soil Health', 'Harvesting', 'Seeds & Varieties', 'Fertilizers', 'Market Prices', 'Government Schemes', 'other'],
        required: true
    },
    image: {
        type: String
    },
    images: [{
        type: String
    }],
    isAnswered: {
        type: Boolean,
        default: false
    },
    answer: {
        content: {
            type: String
        },
        expert: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        answeredAt: {
            type: Date
        }
    },
    upvotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    downvotes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    tags: [{
        type: String,
        trim: true
    }],
    crops: [{
        type: String,
        trim: true
    }]
}, {
    timestamps: true
});

// Indexes for better query performance
forumPostSchema.index({ author: 1 });
forumPostSchema.index({ category: 1 });
forumPostSchema.index({ tags: 1 });
forumPostSchema.index({ createdAt: -1 });
forumPostSchema.index({ isAnswered: 1 });

// Virtual for comment count
forumPostSchema.virtual('commentCount', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'post',
    count: true
});

// Enable virtuals in toJSON output
forumPostSchema.set('toJSON', { virtuals: true });
forumPostSchema.set('toObject', { virtuals: true });

const ForumPost = mongoose.model('ForumPost', forumPostSchema);

export default ForumPost;
