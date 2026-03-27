const Product = require('../models/product');

// @desc    Get RapidMiner Product Recommendations (Simulation)
// @route   GET /api/analytics/recommendations/:userId
// @access  Private
exports.getRecommendations = async (req, res, next) => {
    try {
        // Here we simulate a call to RapidMiner API for a specific user ID.
        // In a real scenario, you'd use axios to call RapidMiner's deployed endpoints.
        
        // For simulation, we randomly pick 4 products from the database
        const count = await Product.countDocuments();
        
        // If few products exist, return all initially
        if (count <= 4) {
            const products = await Product.find({});
            return res.status(200).json({ success: true, count: products.length, data: products });
        }

        const randomRecs = [];
        for (let i = 0; i < 4; i++) {
            const random = Math.floor(Math.random() * count);
            const prod = await Product.findOne().skip(random);
            if (prod && !randomRecs.find(p => p._id.toString() === prod._id.toString())) {
                randomRecs.push(prod);
            }
        }

        res.status(200).json({
            success: true,
            msg: 'Simulated RapidMiner Recommendations',
            data: randomRecs
        });

    } catch (err) {
        next(err);
    }
};
