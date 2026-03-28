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
        console.log(`[SwitchRole] START for user: ${req.user?.id || req.user?._id}`);
        
        const user = await User.findById(req.user.id || req.user._id);

        if (!user) {
            console.error('[SwitchRole] Error: User not found in DB');
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const oldRole = user.role;
        const newRole = oldRole === 'admin' ? 'user' : 'admin';

        console.log(`[SwitchRole] Attempting role transition: ${oldRole} -> ${newRole}`);

        if (oldRole === 'admin' && newRole === 'user') {
            await Product.deleteMany({ user: user.id });
            await Order.deleteMany({ user: user.id });
        }

        user.role = newRole;
        await user.save();

        return res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        console.error('Role Switch Error:', err);
        return res.status(500).json({
            success: false,
            error: err.message || 'Server Error: Role Switching Failed'
        });
    }
};
