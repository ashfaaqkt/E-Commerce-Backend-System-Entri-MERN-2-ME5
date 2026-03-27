const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/user');
const Product = require('./models/product');

const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
};

const products = [
    { name: 'Samsung Galaxy S24', description: 'Latest Samsung flagship with 6.1" AMOLED display and AI features.', price: 74999, category: 'Electronics', stock: 30, ratings: 4.5, numOfReviews: 120, image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400' },
    { name: 'Apple iPhone 15', description: '48MP camera, A16 Bionic chip, and Dynamic Island on 6.1" display.', price: 79900, category: 'Electronics', stock: 25, ratings: 4.8, numOfReviews: 210, image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400' },
    { name: 'Sony WH-1000XM5 Headphones', description: 'Industry-leading noise cancellation with 30-hour battery life.', price: 29990, category: 'Headphones', stock: 50, ratings: 4.7, numOfReviews: 95, image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400' },
    { name: 'Dell Inspiron 15 Laptop', description: 'Intel Core i7, 16GB RAM, 512GB SSD — perfect for work and study.', price: 65499, category: 'Laptops', stock: 15, ratings: 4.3, numOfReviews: 80, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400' },
    { name: 'boAt Rockerz 450 Headphones', description: 'Wireless Bluetooth headphones with 15-hour playback and deep bass.', price: 1499, category: 'Headphones', stock: 100, ratings: 4.1, numOfReviews: 340, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400' },
    { name: 'Canon EOS 200D Mark II', description: '24.1MP DSLR camera with Dual Pixel CMOS AF and 4K video.', price: 42499, category: 'Cameras', stock: 20, ratings: 4.6, numOfReviews: 65, image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400' },
    { name: 'Nike Air Max 270', description: 'Iconic Air Max cushioning in a modern silhouette for all-day comfort.', price: 8995, category: 'Clothes/Shoes', stock: 60, ratings: 4.4, numOfReviews: 180, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
    { name: 'Levi\'s 511 Slim Fit Jeans', description: 'Classic slim fit denim with stretch fabric for everyday comfort.', price: 2999, category: 'Clothes/Shoes', stock: 80, ratings: 4.2, numOfReviews: 250, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400' },
    { name: 'React Native Masters - Book', description: 'Complete guide to building mobile apps with React Native from scratch.', price: 799, category: 'Books', stock: 200, ratings: 4.5, numOfReviews: 60, image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400' },
    { name: 'Noise ColorFit Pro 5 Smartwatch', description: 'Smartwatch with 1.85" AMOLED display, SpO2, and GPS tracking.', price: 3499, category: 'Accessories', stock: 75, ratings: 4.0, numOfReviews: 200, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400' },
    { name: 'Philips Air Fryer HD9252', description: 'Rapid Air technology for crispy food with up to 90% less fat.', price: 6999, category: 'Home', stock: 40, ratings: 4.6, numOfReviews: 310, image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400' },
    { name: 'Syska 20000mAh Power Bank', description: 'Dual USB output, fast charging power bank with LED indicator.', price: 1299, category: 'Accessories', stock: 150, ratings: 4.1, numOfReviews: 420, image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400' },
    { name: 'Himalaya Neem Face Wash', description: 'Purifying neem face wash for clear, healthy skin. 150ml.', price: 149, category: 'Beauty/Health', stock: 300, ratings: 4.4, numOfReviews: 800, image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400' },
    { name: 'Yoga Mat 6mm Non-Slip', description: 'Eco-friendly TPE material with carrying strap, 183cm x 61cm.', price: 999, category: 'Sports', stock: 90, ratings: 4.3, numOfReviews: 150, image: 'https://images.unsplash.com/photo-1601925228136-5f77a6e53083?w=400' },
    { name: 'Logitech MX Master 3 Mouse', description: 'Advanced wireless mouse with MagSpeed scroll and ergonomic design.', price: 8995, category: 'Accessories', stock: 55, ratings: 4.8, numOfReviews: 190, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400' },
    { name: 'Bajaj Majesty Mixer Grinder', description: '750W powerful motor with 3 SS jars for smooth grinding and mixing.', price: 2499, category: 'Home', stock: 70, ratings: 4.2, numOfReviews: 275, image: 'https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400' },
    { name: 'GoPro HERO12 Black', description: 'HyperSmooth 6.0 stabilization, 5.3K60 video, waterproof up to 10m.', price: 34499, category: 'Cameras', stock: 18, ratings: 4.7, numOfReviews: 85, image: 'https://images.unsplash.com/photo-1551244072-5d12893278bc?w=400' },
    { name: 'JBL Charge 5 Speaker', description: 'Portable waterproof Bluetooth speaker with 20 hours of playtime.', price: 14999, category: 'Accessories', stock: 45, ratings: 4.6, numOfReviews: 160, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400' },
];

const seedDB = async () => {
    try {
        await connectDB();

        // Clear existing data
        await User.deleteMany({});
        await Product.deleteMany({});
        console.log('Cleared existing data.');

        // Create admin user (password will be hashed by model pre-save hook)
        const admin = await User.create({
            name: 'Ashfaaq',
            email: 'ashfaaq@admin.com',
            password: 'ashfaaq123',
            role: 'admin'
        });
        console.log(`Admin created: ${admin.email}`);

        // Add products with admin as creator
        const productsWithUser = products.map(p => ({ ...p, user: admin._id }));
        await Product.insertMany(productsWithUser);
        console.log(`${products.length} products seeded!`);

        console.log('\n✅ Database seeded successfully!');
        console.log('Admin Login -> Email: ashfaaq@admin.com | Password: ashfaaq123');
        process.exit(0);
    } catch (err) {
        console.error('Seed error:', err);
        process.exit(1);
    }
};

seedDB();
