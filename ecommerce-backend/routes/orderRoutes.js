const express = require('express');
const { addOrderItems, getMyOrders, getAllOrders } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').post(protect, addOrderItems);
router.route('/myorders').get(protect, getMyOrders);
router.route('/all').get(protect, authorize('admin'), getAllOrders);

module.exports = router;
