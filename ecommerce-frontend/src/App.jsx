import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import Shipping from './pages/Shipping';
import PlaceOrder from './pages/PlaceOrder';
import OrderConfirmation from './pages/OrderConfirmation';
import Orders from './pages/Orders';
import AdminDashboard from './pages/AdminDashboard';

// Placeholder Pages
const Contact = () => <div className="p-8 text-center text-2xl font-bold min-h-screen">Contact Page</div>;

// Protected Route: only for logged-in users
const PrivateRoute = ({ children }) => {
    const { userInfo } = useSelector((state) => state.auth);
    return userInfo ? children : <Navigate to="/login" replace />;
};

// Admin Route: only for admins
const AdminRoute = ({ children }) => {
    const { userInfo } = useSelector((state) => state.auth);
    if (!userInfo) return <Navigate to="/login" replace />;
    if (userInfo.role !== 'admin') return <Navigate to="/" replace />;
    return children;
};

function App() {
    const { darkMode } = useSelector((state) => state.theme);

    return (
        <div className={`${darkMode ? 'dark' : ''} flex flex-col min-h-screen bg-gradient-to-b ${darkMode ? 'from-black to-gray-900 border-gray-800' : 'from-blue-900 to-white border-blue-100'} text-gray-800 transition-colors duration-500`}>
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/shipping" element={<PrivateRoute><Shipping /></PrivateRoute>} />
                    <Route path="/placeorder" element={<PrivateRoute><PlaceOrder /></PrivateRoute>} />
                    <Route path="/order-confirmation/:id" element={<PrivateRoute><OrderConfirmation /></PrivateRoute>} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
                    <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                    <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
}

export default App;
