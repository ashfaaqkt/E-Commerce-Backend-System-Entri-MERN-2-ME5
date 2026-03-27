import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaShoppingCart, FaUser } from 'react-icons/fa';
import { logout } from '../redux/slices/authSlice';

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.auth);
    const { cartItems } = useSelector((state) => state.cart);

    const logoutHandler = () => {
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
                        <div className="relative group">
                            <button className="flex items-center hover:text-blue-300 transition focus:outline-none">
                                <FaUser className="mr-2 text-xl" />
                                <span className="font-semibold">{userInfo.name}</span>
                            </button>
                            <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 invisible group-hover:visible">
                                <Link to="/profile" className="block px-4 py-2 hover:bg-blue-100">Profile</Link>
                                <button onClick={logoutHandler} className="block w-full text-left px-4 py-2 hover:bg-blue-100">Logout</button>
                            </div>
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
