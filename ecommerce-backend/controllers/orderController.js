const Order = require('../models/order');
const Product = require('../models/product');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.addOrderItems = async (req, res, next) => {
    try {
        const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

        if (orderItems && orderItems.length === 0) {
            return res.status(400).json({ success: false, error: 'No order items' });
        }

        const order = new Order({
            orderItems,
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        });

        const createdOrder = await order.save();
        res.status(201).json({ success: true, data: createdOrder });
    } catch (err) {
        next(err);
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (!order) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }

        res.status(200).json({ success: true, data: order });
    } catch (err) {
        next(err);
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user._id });
        res.status(200).json({ success: true, data: orders });
    } catch (err) {
        next(err);
    }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders/all
// @access  Private/Admin
exports.getAllOrders = async (req, res, next) => {
    try {
        // Find products owned by this admin
        const myProducts = await Product.find({ user: req.user._id }).select('_id');
        const myProductIds = myProducts.map(p => p._id.toString());

        // Find orders that contain at least one of my products
        // ALSO filter out orders placed BY this admin to prevent self-management
        const orders = await Order.find({
            'orderItems.product': { $in: myProductIds },
            'user': { $ne: req.user._id }
        }).populate('user', 'name email').populate('orderItems.product', 'user');

        res.status(200).json({ success: true, data: orders });
    } catch (err) {
        next(err);
    }
};
// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate('orderItems.product', 'user');

        if (!order) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }

        // Verify if admin owns at least one product in this order
        const isOwner = order.orderItems.some(item => 
            item.product && item.product.user && item.product.user.toString() === req.user._id.toString()
        );

        if (!isOwner) {
            return res.status(401).json({ success: false, error: 'Not authorized to update this order' });
        }

        order.status = req.body.status;

        if (req.body.status === 'Delivered') {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
        }

        const updatedOrder = await order.save();

        res.status(200).json({ success: true, data: updatedOrder });
    } catch (err) {
        next(err);
    }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
exports.cancelOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }

        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        if (order.status === 'Shipped' || order.status === 'Delivered' || order.status === 'Cancelled' || order.status === 'Failed') {
            return res.status(400).json({ success: false, error: 'Order cannot be cancelled at this stage' });
        }

        order.status = 'Cancelled';
        await order.save();

        res.status(200).json({ success: true, data: order });
    } catch (err) {
        next(err);
    }
};
