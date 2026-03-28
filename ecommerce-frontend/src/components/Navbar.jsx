import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaShoppingCart, FaUser, FaChevronDown, FaSun, FaMoon, FaShoppingBasket } from 'react-icons/fa';
import { logout } from '../redux/slices/authSlice';
import { toggleTheme } from '../redux/slices/themeSlice';

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.auth);
    const { cartItems } = useSelector((state) => state.cart);
    const { darkMode } = useSelector((state) => state.theme);

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
        <nav className={`${darkMode ? 'bg-black/90 border-b border-gray-800' : 'bg-blue-800'} text-white shadow-lg sticky top-0 z-50 backdrop-blur-md transition-colors duration-500 rounded-b-3xl`}>
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="hover:text-blue-200 transition-all duration-300 transform hover:scale-110 active:scale-95" title="Home">
                    <FaShoppingBasket className={`text-4xl ${darkMode ? 'text-blue-400' : 'text-white'}`} />
                </Link>
                <div className="flex items-center space-x-2 sm:space-x-4">
                    {/* Theme Toggle */}
                    <button
                        onClick={() => dispatch(toggleTheme())}
                        className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 transform hover:scale-110 active:rotate-12"
                        title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    >
                        {darkMode ? (
                            <FaSun className="text-yellow-400 text-xl" />
                        ) : (
                            <FaMoon className="text-blue-200 text-xl" />
                        )}
                    </button>

                    <Link 
                        to="/cart" 
                        className="flex items-center px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 active:scale-95 group shadow-sm"
                    >
                        <FaShoppingCart className="mr-2 text-xl" />
                        <span className="font-semibold hidden sm:inline text-sm">Cart </span>
                        {cartItems.length > 0 && (
                            <span className="ml-1.5 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                                {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                            </span>
                        )}
                    </Link>

                    {userInfo ? (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none shadow-sm"
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                            >
                                <FaUser className="text-xl" />
                                <span className="font-semibold hidden sm:inline text-sm">{userInfo.name.split(' ')[0]}</span>
                                <FaChevronDown className={`text-xs transition-transform duration-200 hidden sm:inline ${dropdownOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {dropdownOpen && (
                                <div className={`absolute right-0 mt-3 w-48 rounded-2xl shadow-2xl overflow-hidden z-50 border ${darkMode ? 'bg-gray-900 text-white border-gray-700' : 'bg-white text-gray-800 border-blue-100'}`}>
                                    {userInfo.role === 'admin' && (
                                        <Link
                                            to="/admin"
                                            onClick={() => setDropdownOpen(false)}
                                            className={`block px-4 py-3 font-medium transition-colors ${darkMode ? 'hover:bg-gray-800 text-blue-400' : 'hover:bg-blue-50 text-blue-700'}`}
                                        >
                                            🛠 Admin Dashboard
                                        </Link>
                                    )}
                                    <Link
                                        to="/profile"
                                        onClick={() => setDropdownOpen(false)}
                                        className={`block px-4 py-3 font-medium transition-colors ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-blue-50'}`}
                                    >
                                        My Profile
                                    </Link>
                                    <Link
                                        to="/orders"
                                        onClick={() => setDropdownOpen(false)}
                                        className={`block px-4 py-3 font-medium transition-colors ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-blue-50'}`}
                                    >
                                        My Orders
                                    </Link>
                                    <hr className={darkMode ? 'border-gray-800' : 'border-gray-100'} />
                                    <button
                                        onClick={logoutHandler}
                                        className={`block w-full text-left px-4 py-3 text-red-600 font-medium transition-colors ${darkMode ? 'hover:bg-red-900/20' : 'hover:bg-red-50'}`}
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link 
                            to="/login" 
                            className="flex items-center px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-sm"
                        >
                            <FaUser className="mr-2 text-lg" />
                            <span className="font-semibold hidden sm:inline text-sm">Log In</span>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
