import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaTrash, FaShoppingCart, FaArrowRight } from 'react-icons/fa';
import { addToCart, removeFromCart } from '../redux/slices/cartSlice';

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cartItems } = useSelector((state) => state.cart);
    const { userInfo } = useSelector((state) => state.auth);
    const { darkMode } = useSelector((state) => state.theme);

    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id));
    };

    const checkoutHandler = () => {
        if (!userInfo) {
            navigate('/login?redirect=/shipping');
            return;
        }
        // If user already has address details, skip to place order
        if (userInfo.address && userInfo.address.street) {
            // Sync with local storage expected by PlaceOrder
            localStorage.setItem('shippingAddress', JSON.stringify({
                address: userInfo.address.street,
                city: userInfo.address.city,
                postalCode: userInfo.address.zip,
                country: userInfo.address.country,
                phone: userInfo.phone
            }));
            navigate('/placeorder');
        } else {
            navigate('/shipping');
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            <h1 className="text-4xl font-extrabold text-white mb-8 flex items-center gap-3">
                <FaShoppingCart className={darkMode ? 'text-blue-400' : 'text-blue-300'} /> My Shopping Cart
            </h1>

            {cartItems.length === 0 ? (
                <div className={`rounded-3xl shadow-xl p-12 text-center border transition-colors ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-blue-50'}`}>
                    <div className="text-6xl mb-6">🛒</div>
                    <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Your cart is empty</h2>
                    <p className={`mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Looks like you haven't added anything to your cart yet.</p>
                    <Link to="/" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg">
                        Go Shopping
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <div key={item.product} className={`rounded-2xl shadow-md p-4 flex items-center gap-4 border transition hover:shadow-lg ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-blue-50'}`}>
                                <div className={`w-24 h-24 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0 ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                    ) : (
                                        <div className="text-blue-200 font-bold">No Image</div>
                                    )}
                                </div>
                                <div className="flex-grow">
                                    <h3 className={`text-lg font-bold line-clamp-1 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>{item.name}</h3>
                                    <p className={`font-extrabold text-lg mt-1 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>₹{item.price.toLocaleString('en-IN')}</p>
                                    <div className="flex items-center gap-4 mt-2">
                                        <div className={`flex items-center border rounded-lg overflow-hidden ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                                            <button 
                                                onClick={() => dispatch(addToCart({ ...item, qty: Math.max(1, item.qty - 1) }))}
                                                className={`px-3 py-1 font-bold ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-50 hover:bg-gray-100 text-gray-600'}`}
                                            >-</button>
                                            <span className={`px-4 py-1 font-semibold ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'}`}>{item.qty}</span>
                                            <button 
                                                onClick={() => dispatch(addToCart({ ...item, qty: Math.min(item.countInStock, item.qty + 1) }))}
                                                className={`px-3 py-1 font-bold ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-50 hover:bg-gray-100 text-gray-600'}`}
                                            >+</button>
                                        </div>
                                        <button 
                                            onClick={() => removeFromCartHandler(item.product)}
                                            className="text-red-500 hover:text-red-700 p-2 transition"
                                        >
                                            <FaTrash size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className={`rounded-3xl shadow-xl p-6 border sticky top-24 transition-colors ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-blue-50'}`}>
                            <h2 className={`text-xl font-bold mb-6 pb-4 border-b ${darkMode ? 'text-gray-100 border-gray-700' : 'text-gray-800 border-gray-100'}`}>Order Summary</h2>
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between">
                                    <span className={darkMode ? 'text-gray-400 font-medium' : 'text-gray-600'}>Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})</span>
                                    <span className={darkMode ? 'text-gray-100 font-bold' : 'text-gray-600'}>₹{cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className={darkMode ? 'text-gray-400 font-medium' : 'text-gray-600'}>Shipping</span>
                                    <span className="text-green-600 font-semibold">FREE</span>
                                </div>
                                <div className={`flex justify-between text-xl font-extrabold pt-4 border-t ${darkMode ? 'text-white border-gray-700' : 'text-blue-900 border-gray-100'}`}>
                                    <span>Total</span>
                                    <span>₹{cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                            <button
                                onClick={checkoutHandler}
                                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition shadow-lg flex items-center justify-center gap-2 group"
                            >
                                Checkout <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
