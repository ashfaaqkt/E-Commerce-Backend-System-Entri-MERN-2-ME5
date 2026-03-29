const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/dbConnection');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

// Middleware
app.use(
    cors({
        origin(origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(null, false);
            }
        },
        credentials: true,
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic error handler
const { errorHandler } = require('./middleware/errorHandler');

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/analytics', require('./routes/adminRoutes'));
app.use('/api/seed', require('./routes/seedRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

app.use(errorHandler);

const PORT = process.env.PORT || 5002;

app.get('/api/health', (req, res) => {
    res.status(200).json({ success: true, message: 'Basket API is running' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
