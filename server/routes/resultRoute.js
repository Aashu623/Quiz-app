const express = require('express');

const {
    addResult,
    getAllResults,
    deleteResult
} = require('../controllers/resultController');

const { isAuthenticatedUser, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.route('/results').get(getAllResults);
router.route('/result/submit').post(addResult);
router.route('/result/:id').delete(deleteResult);


module.exports = router;