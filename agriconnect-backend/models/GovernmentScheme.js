import mongoose from 'mongoose';

const governmentSchemeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    state: {
        type: String,
        required: [true, 'State is required'],
        trim: true
    },
    eligibility: [{
        type: String,
        required: [true, 'Eligibility criteria is required']
    }],
    details: {
        type: String,
        required: [true, 'Scheme details are required']
    },
    benefits: [{
        type: String
    }],
    steps: [{
        type: String,
        required: [true, 'At least one step is required']
    }],
    documentLink: {
        type: String,
        required: [true, 'Document link is required']
    },
    deadline: {
        type: Date
    },
    tags: [{
        type: String,
        trim: true
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Indexes for better query performance
governmentSchemeSchema.index({ title: 'text', details: 'text', tags: 'text' });
governmentSchemeSchema.index({ state: 1, isActive: 1 });
governmentSchemeSchema.index({ createdAt: -1 });

export default mongoose.model('GovernmentScheme', governmentSchemeSchema);
