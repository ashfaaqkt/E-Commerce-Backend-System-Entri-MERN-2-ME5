const express = require('express');
const { addOrderItems, getMyOrders, getAllOrders, updateOrderStatus, getOrderById, cancelOrder } = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').post(protect, addOrderItems);
router.route('/myorders').get(protect, getMyOrders);
router.route('/all').get(protect, authorize('admin'), getAllOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/cancel').put(protect, cancelOrder);
router.route('/:id/status').put(protect, authorize('admin'), updateOrderStatus);

module.exports = router;
