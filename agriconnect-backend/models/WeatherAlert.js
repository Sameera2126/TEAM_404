const mongoose = require('mongoose');

const weatherAlertSchema = new mongoose.Schema({
    location: {
        state: {
            type: String,
            required: [true, 'State is required']
        },
        district: {
            type: String,
            required: [true, 'District is required']
        }
    },
    alertType: {
        type: String,
        enum: ['weather', 'disease', 'govNotice'],
        required: [true, 'Alert type is required']
    },
    message: {
        type: String,
        required: [true, 'Alert message is required']
    },
    severity: {
        type: String,
        enum: ['info', 'warning', 'critical'],
        default: 'info'
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required']
    },
    endDate: {
        type: Date
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Indexes for better query performance
weatherAlertSchema.index({ 'location.state': 1, 'location.district': 1 });
weatherAlertSchema.index({ alertType: 1, isActive: 1 });
weatherAlertSchema.index({ severity: 1 });
weatherAlertSchema.index({ startDate: -1 });

module.exports = mongoose.model('WeatherAlert', weatherAlertSchema);
