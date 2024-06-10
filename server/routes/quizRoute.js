const express = require('express');
const {
    addQuiz,
    getSingleQuiz,
    getAllQuizzes,
    updateQuiz,
    deleteQuiz
} = require('../controllers/quizController');

const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.route('/quizs').get(getAllQuizzes);
router.route('/quiz').post(getSingleQuiz)
router.route('/quiz/new').post(addQuiz);
router.route('/quiz/update/:id').put(updateQuiz).delete(deleteQuiz);


module.exports = router;