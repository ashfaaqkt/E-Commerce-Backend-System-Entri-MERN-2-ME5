import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaShoppingCart, FaUser, FaChevronDown, FaSun, FaMoon, FaShoppingBasket, FaSearch, FaTimes } from 'react-icons/fa';
import { logout } from '../redux/slices/authSlice';
import { toggleTheme } from '../redux/slices/themeSlice';
import { fetchProducts, setKeyword } from '../redux/slices/productSlice';

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.auth);
    const { cartItems } = useSelector((state) => state.cart);
    const { darkMode } = useSelector((state) => state.theme);
    const { products } = useSelector((state) => state.products);

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showMobileSearch, setShowMobileSearch] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const dropdownRef = useRef(null);
    const searchRef = useRef(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setSuggestions([]);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        dispatch(setKeyword(searchTerm));
        dispatch(fetchProducts(searchTerm));
        setSuggestions([]);
        setShowMobileSearch(false);
        navigate('/');
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (value.trim().length > 1) {
            const matches = products.filter(p => 
                p.name.toLowerCase().includes(value.toLowerCase()) ||
                p.category.toLowerCase().includes(value.toLowerCase())
            ).slice(0, 5);
            setSuggestions(matches);
        } else {
            setSuggestions([]);
        }
    };

    const logoutHandler = () => {
        setDropdownOpen(false);
        dispatch(logout());
        navigate('/login');
    };

    return (
        <nav className={`${darkMode ? 'bg-black/90 border-b border-gray-800' : 'bg-blue-800'} text-white shadow-lg sticky top-0 z-50 backdrop-blur-md transition-all duration-500 rounded-b-3xl`}>
            {/* Desktop Navbar */}
            <div className="container mx-auto px-6 py-4 flex justify-between items-center gap-4">
                {/* Logo */}
                <Link to="/" className="hover:text-blue-200 transition-all duration-300 transform hover:scale-110 active:scale-95 flex-shrink-0" title="Home">
                    <FaShoppingBasket className={`text-3xl sm:text-4xl ${darkMode ? 'text-blue-400' : 'text-white'}`} />
                </Link>

                {/* Desktop Search Bar */}
                <div className="hidden md:flex flex-1 max-w-xl relative" ref={searchRef}>
                    <div className={`flex items-center w-full px-4 py-2 rounded-2xl border transition-all duration-300 ${
                        darkMode ? 'bg-white/5 border-gray-700 focus-within:border-blue-500' : 'bg-white/10 border-blue-400/30 focus-within:border-white'
                    }`}>
                        <FaSearch className="text-gray-400 mr-3" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleInputChange}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="Search products..."
                            className="bg-transparent text-sm w-full outline-none placeholder-gray-400 font-medium"
                        />
                    </div>

                    {/* Suggestions Dropdown */}
                    {suggestions.length > 0 && (
                        <div className={`absolute top-full left-0 w-full mt-2 rounded-2xl shadow-2xl overflow-hidden border z-50 animate-in fade-in zoom-in duration-200 ${
                            darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-blue-100 text-gray-800'
                        }`}>
                            {suggestions.map((p) => (
                                <button
                                    key={p._id}
                                    onClick={() => {
                                        setSearchTerm(p.name);
                                        handleSearch();
                                    }}
                                    className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-colors ${
                                        darkMode ? 'hover:bg-gray-800' : 'hover:bg-blue-50'
                                    }`}
                                >
                                    <img src={p.image} alt="" className="w-8 h-8 rounded-lg object-contain bg-gray-100 p-1" />
                                    <span className="font-semibold truncate">{p.name}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Actions Group */}
                <div className="flex items-center space-x-2 sm:space-x-3">
                    {/* Mobile Search Toggle */}
                    <button
                        onClick={() => setShowMobileSearch(!showMobileSearch)}
                        className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 transform hover:scale-110"
                    >
                        {showMobileSearch ? <FaTimes size={18} /> : <FaSearch size={18} />}
                    </button>

                    {/* Theme Toggle */}
                    <button
                        onClick={() => dispatch(toggleTheme())}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 transform hover:scale-110 active:rotate-12"
                        title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    >
                        {darkMode ? <FaSun className="text-yellow-400 text-xl" /> : <FaMoon className="text-blue-200 text-xl" />}
                    </button>

                    <Link 
                        to="/cart" 
                        className="flex items-center px-3 h-10 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 active:scale-95 group shadow-sm"
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
                                className="flex items-center gap-2 px-3 h-10 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none shadow-sm"
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
                            className="flex items-center px-4 h-10 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-sm"
                        >
                            <FaUser className="mr-2 text-lg" />
                            <span className="font-semibold hidden sm:inline text-sm">Log In</span>
                        </Link>
                    )}
                </div>
            </div>

            {/* Mobile Search Bar Expansion */}
            <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                showMobileSearch ? 'max-h-20 opacity-100 py-3 border-t border-white/10' : 'max-h-0 opacity-0'
            }`}>
                <div className="container mx-auto px-6">
                    <div className={`flex items-center px-4 py-2 rounded-2xl border transition-all duration-300 ${
                        darkMode ? 'bg-white/5 border-gray-700 focus-within:border-blue-500' : 'bg-white/10 border-blue-400/30 focus-within:border-white'
                    }`}>
                        <FaSearch className="text-gray-400 mr-3" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleInputChange}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            placeholder="Search products..."
                            className="bg-transparent text-sm w-full outline-none placeholder-gray-400 font-medium"
                        />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
