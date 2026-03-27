import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaShoppingCart, FaUser, FaChevronDown } from 'react-icons/fa';
import { logout } from '../redux/slices/authSlice';

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.auth);
    const { cartItems } = useSelector((state) => state.cart);

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const logoutHandler = () => {
        setDropdownOpen(false);
        dispatch(logout());
        navigate('/login');
    };

    return (
        <nav className="bg-blue-800 text-white shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold tracking-wider hover:text-blue-200 transition">
                    ME5 E-Commerce
                </Link>
                <div className="flex items-center space-x-6">
                    <Link to="/cart" className="flex items-center hover:text-blue-300 transition">
                        <FaShoppingCart className="mr-2 text-xl" />
                        <span className="font-semibold">
                            Cart
                            {cartItems.length > 0 && (
                                <span className="ml-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                    {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                                </span>
                            )}
                        </span>
                    </Link>
                    {userInfo ? (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                className="flex items-center gap-2 hover:text-blue-300 transition focus:outline-none"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                            >
                                <FaUser className="text-xl" />
                                <span className="font-semibold">{userInfo.name}</span>
                                <FaChevronDown className={`text-xs transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-xl shadow-2xl overflow-hidden z-50">
                                    {userInfo.role === 'admin' && (
                                        <Link
                                            to="/admin"
                                            onClick={() => setDropdownOpen(false)}
                                            className="block px-4 py-3 hover:bg-blue-50 font-medium transition-colors text-blue-700"
                                        >
                                            🛠 Admin Dashboard
                                        </Link>
                                    )}
                                    <Link
                                        to="/profile"
                                        onClick={() => setDropdownOpen(false)}
                                        className="block px-4 py-3 hover:bg-blue-50 font-medium transition-colors"
                                    >
                                        My Profile
                                    </Link>
                                    <Link
                                        to="/orders"
                                        onClick={() => setDropdownOpen(false)}
                                        className="block px-4 py-3 hover:bg-blue-50 font-medium transition-colors"
                                    >
                                        My Orders
                                    </Link>
                                    <hr className="border-gray-100" />
                                    <button
                                        onClick={logoutHandler}
                                        className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 font-medium transition-colors"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login" className="flex items-center hover:text-blue-300 transition">
                            <FaUser className="mr-2 text-xl" />
                            <span className="font-semibold">Log In</span>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
