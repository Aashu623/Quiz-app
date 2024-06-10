const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: [true, "Please enter your name"] },
    enrollment: { type: String, required: [true, "Please enter your enrollment number"], unique: true },
    email: { type: String, required: [true, "Please enter your email"] },
    password: { type: String, required: [true, "Please enter your password"] },
    branch: { type: String, required: [true, "Please enter your branch"] },
    role: { type: String, default: 'Student' },
    quizzesTaken: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }],
    createdAt: { type: Date, default: Date.now }
});



module.exports = mongoose.model('User', userSchema);
