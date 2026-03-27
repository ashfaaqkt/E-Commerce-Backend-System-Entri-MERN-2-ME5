const express = require('express');
const { getUserProfile, updateUserProfile } = require('../controllers/userProfile');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

module.exports = router;
