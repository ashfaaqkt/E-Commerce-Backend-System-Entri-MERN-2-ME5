const Product = require('../models/product');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res, next) => {
    try {
        const keyword = req.query.keyword ? {
            name: {
                $regex: req.query.keyword,
                $options: 'i'
            }
        } : {};

        let query = Product.find({ ...keyword });

        // Category filter
        if (req.query.category) {
            query = query.where('category').equals(req.query.category);
        }

        // Price filter gte and lte
        if (req.query.minPrice || req.query.maxPrice) {
            let priceFilter = {};
            if (req.query.minPrice) priceFilter.$gte = Number(req.query.minPrice);
            if (req.query.maxPrice) priceFilter.$lte = Number(req.query.maxPrice);
            query = query.where('price', priceFilter);
        }

        const products = await query;

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found' });
        }

        res.status(200).json({ success: true, data: product });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res, next) => {
    try {
        req.body.user = req.user.id;
        const product = await Product.create(req.body);

        res.status(201).json({
            success: true,
            data: product
        });
    } catch (err) {
        next(err);
    }
};
