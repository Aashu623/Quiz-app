const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    quiz: { type: mongoose.Schema.ObjectId, ref: 'Quiz', required: true },
    score: { type: Number },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Result", resultSchema);
