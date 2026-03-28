const express = require('express');
const { getUserProfile, updateUserProfile, switchRole } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

router.put('/switch-role', protect, switchRole);

module.exports = router;
