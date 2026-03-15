const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member',
        required: true
    },
    problemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem',
        required: true
    },
    code: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error', 'Compilation Error', 'Pending'],
        default: 'Pending'
    },
    runtime: {
        type: String
    },
    memory: {
        type: String
    },
    token: {
        type: String // Judge0 submission token
    }
}, { timestamps: true });

module.exports = mongoose.model('Submission', SubmissionSchema);
