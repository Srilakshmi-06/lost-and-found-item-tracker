const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Description is required']
    },
    category: {
        type: String,
        required: true,
        enum: ['electronics', 'accessories', 'books', 'clothing', 'others']
    },
    location: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    imageUrl: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        default: []
    },
    type: {
        type: String,
        required: true,
        enum: ['lost', 'found']
    },
    status: {
        type: String,
        required: true,
        enum: ['lost', 'found', 'matched'],
        default: function() { return this.type; }
    },
    moderationStatus: {
        type: String,
        enum: ['approved', 'pending', 'rejected'],
        default: 'approved'
    }
}, { timestamps: true });

// Add text indexing for simple keyword search
itemSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Item', itemSchema);
