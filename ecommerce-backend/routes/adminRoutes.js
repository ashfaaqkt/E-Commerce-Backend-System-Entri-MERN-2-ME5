const express = require('express');
const { getRecommendations } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/recommendations/:userId')
    .get(protect, getRecommendations);

module.exports = router;
