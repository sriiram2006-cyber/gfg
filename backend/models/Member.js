const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    branch: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Member', MemberSchema);
