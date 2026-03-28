import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
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
import SaleBoard from './pages/SaleBoard';
import ScrollToTop from './components/ScrollToTop';
import Chatbot from './components/Chatbot';
import SubNavbar from './components/SubNavbar';

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
    const [chatOpen, setChatOpen] = useState(false);

    // Apply theme to document root for scrollbar and system theme awareness
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            document.documentElement.style.colorScheme = 'dark';
        } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.style.colorScheme = 'light';
        }
    }, [darkMode]);

    return (
        <div className={`${darkMode ? 'dark' : ''} flex flex-col min-h-screen bg-gradient-to-b ${darkMode ? 'from-black to-gray-900 border-gray-800' : 'from-blue-900 to-white border-blue-100'} text-gray-800 transition-colors duration-500`}>
            <Navbar onOpenChange={setChatOpen} />
            <SubNavbar />
            <main className="container mx-auto px-6 py-10 flex-grow">
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
                    <Route path="/saleboard" element={<AdminRoute><SaleBoard /></AdminRoute>} />
                </Routes>
            </main>
            <Footer />
            <Chatbot onOpenChange={setChatOpen} />
            <ScrollToTop chatOpen={chatOpen} />
        </div>
    );
}

export default App;
