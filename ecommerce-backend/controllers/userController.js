const User = require('../models/user');
const Product = require('../models/product');
const Order = require('../models/order');

// @desc    Get current logged in user
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res, next) => {
    try {
        const fieldsToUpdate = {
            name: req.body.name,
            phone: req.body.phone,
            address: req.body.address,
            avatar: req.body.avatar
        };

        const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Switch user role (Customer <-> Seller)
// @route   PUT /api/users/switch-role
// @access  Private
exports.switchRole = async (req, res, next) => {
    try {
        console.log(`[SwitchRole] Attempting for user: ${req.user?._id}`);
        
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const oldRole = user.role;
        const newRole = oldRole === 'admin' ? 'user' : 'admin';

        console.log(`[SwitchRole] Transitioning from ${oldRole} to ${newRole}`);

        // If switching from Seller to Customer, delete all products and orders
        if (oldRole === 'admin' && newRole === 'user') {
            console.log(`[SwitchRole] Deleting data for user ${user._id}`);
            const productsDeleted = await Product.deleteMany({ user: user._id });
            const ordersDeleted = await Order.deleteMany({ user: user._id });
            console.log(`[SwitchRole] Deleted ${productsDeleted.deletedCount} products and ${ordersDeleted.deletedCount} orders`);
        }

        user.role = newRole;
        await user.save();

        console.log(`[SwitchRole] Role updated successfully to: ${user.role}`);

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        console.error('[SwitchRole] Error:', err);
        // Safety check for next function to prevent "next is not a function"
        if (typeof next === 'function') {
            return next(err);
        }
        res.status(500).json({ success: false, error: err.message || 'Server Error' });
    }
};
