const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  quizId: {
    type: Number,
    default: function () {
      return Math.floor(Math.random() * (900000 - 100000 + 1)) + 100000;
    },
    unique: true
  },
  title: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questions: [{
    questionNumber: { type: Number },
    text: { type: String, required: true },
    code: { type: String },
    options: [{ type: String, required: true }],
    correctOptionIndex: { type: Number, required: true },
  }],
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  results: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, score: Number }],
  createdAt: { type: Date, default: Date.now }
});

// Pre-save middleware to assign question numbers
quizSchema.pre('save', function (next) {
  if (this.questions) {
    this.questions.forEach((question, index) => {
      if (!question.questionNumber) {
        question.questionNumber = index + 1;
      }
    });
  }
  next();
});

module.exports = mongoose.model("Quiz", quizSchema);
