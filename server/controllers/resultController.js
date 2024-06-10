const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Result = require('../models/resultModel');
const User = require('../models/userModel');
const Quiz = require('../models/quizModel');


//ADD result
exports.addResult = async (req, res, next) => {
    try {
        const { resultArray, quiz, user } = req.body;

        const crrQuiz = await Quiz.findById(quiz._id).select('questions'); // Fetch only the questions field
        if (!crrQuiz) {
            return res.status(404).json({
                success: false,
                message: "Quiz not found",
            });
        }

        let score = 0;
        const questionMap = new Map(crrQuiz.questions.map(q => [q._id.toString(), q])); // Create a map for quick lookup

        resultArray.forEach(item => {
            const question = questionMap.get(item.questionId);
            if (question && item.selectedOption === question.options[question.correctOptionIndex]) {
                score++;
            }
        });

        const result = await Result.create({ user: user._id, quiz: quiz._id, score });
        res.status(201).json({
            success: true,
            score,
            message: "Result Saved Successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

//GET ALL result --ADMIN
exports.getAllResults = catchAsyncErrors(async (req, res, next) => {

    const results = await Result.find()
            .populate('user', 'name enrollment branch') // Include only necessary user details
            .populate('quiz', 'title') // Include only necessary quiz details
            .select('user quiz score');

    res.status(200).json({
        success: true,
        results
    })
});

//DELETE result --ADMIN
exports.deleteResult = catchAsyncErrors(async (req, res, next) => {

    const result = await Result.findById(req.params.id);

    if (!result) {
        return next(new ErrorHandler(`result does not exist with Id:${req.params.id}`));
    }

    await result.deleteOne();

    res.status(200).json({
        success: true,
        message: "Result Deleted Successfully"
    })
})