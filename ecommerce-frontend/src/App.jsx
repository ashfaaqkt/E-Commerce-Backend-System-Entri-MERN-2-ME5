import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';

// Placeholder Pages
const Cart = () => <div className="p-8 text-center text-2xl font-bold min-h-screen">Cart Page</div>;
const Orders = () => <div className="p-8 text-center text-2xl font-bold min-h-screen">My Orders Page</div>;
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
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-900 to-white text-gray-800 font-sans">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/cart" element={<Cart />} />
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
