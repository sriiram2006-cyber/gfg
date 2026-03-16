const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Beginner Programming', 'DSA Preparation', 'Interview Prep']
    },
    link: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true,
        enum: ['Beginner', 'Intermediate', 'Advanced']
    },
    description: {
        type: String,
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model('Resource', ResourceSchema);
