const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Quiz = require('../models/quizModel');
const User = require('../models/userModel');


//ADD Quiz
exports.addQuiz = async (req, res, next) => {

    const {
        title,
        userId,
        questions
    } = req.body;

    const user = await User.findById(userId);

    const quiz = await Quiz.create({ title, createdBy: userId, questions: questions });

    res.status(201).json({
        success: true,
        message: "Quiz Created Successfully",
    });
};

//GET SINGLE QUIZ
exports.getSingleQuiz = async (req, res, next) => {

    const { quizId } = req.body;

    const quiz = await Quiz.findOne({ quizId: quizId });

    if (!quiz) {
        return new ErrorHandler("Invalid Quiz Id", 400)
    }

    res.status(201).json({
        success: true,
        quiz
    });
};

//GET ALL Quiz --ADMIN
exports.getAllQuizzes = catchAsyncErrors(async (req, res, next) => {

    const Quizs = await Quiz.find();

    res.status(200).json({
        success: true,
        Quizs
    })
});

exports.updateQuiz = catchAsyncErrors(async (req, res, next) => {
    const { title, questions } = req.body;

    // Find the quiz by ID
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
        return next(new ErrorHandler("Quiz does not exist", 400)); // Pass error to the next middleware
    }

    // Concatenate the existing questions with the new questions
    const updatedQuestions = [...quiz.questions, ...questions];

    const newData = { title, questions: updatedQuestions };

    // Update the quiz with the new data
    const updatedQuiz = await Quiz.findByIdAndUpdate(req.params.id, newData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        message: "Quiz Updated Successfully",
    });
});

//DELETE Quiz --ADMIN
exports.deleteQuiz = catchAsyncErrors(async (req, res, next) => {

    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
        return next(new ErrorHandler(`Quiz does not exist with Id:${req.params.id}`));
    }

    await quiz.deleteOne();

    res.status(200).json({
        success: true,
        message: "Quiz Deleted Successfully"
    })
})