import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaTrash, FaShoppingCart, FaArrowRight } from 'react-icons/fa';
import { addToCart, removeFromCart } from '../redux/slices/cartSlice';

const Cart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cartItems } = useSelector((state) => state.cart);
    const { userInfo } = useSelector((state) => state.auth);

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
            <h1 className="text-4xl font-extrabold text-blue-900 mb-8 flex items-center gap-3">
                <FaShoppingCart className="text-blue-600" /> My Shopping Cart
            </h1>

            {cartItems.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-blue-50">
                    <div className="text-6xl mb-6">🛒</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
                    <p className="text-gray-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
                    <Link to="/" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg">
                        Go Shopping
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <div key={item.product} className="bg-white rounded-2xl shadow-md p-4 flex items-center gap-4 border border-blue-50 transition hover:shadow-lg">
                                <div className="w-24 h-24 bg-blue-50 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                    ) : (
                                        <div className="text-blue-200 font-bold">No Image</div>
                                    )}
                                </div>
                                <div className="flex-grow">
                                    <h3 className="text-lg font-bold text-gray-800 line-clamp-1">{item.name}</h3>
                                    <p className="text-blue-600 font-extrabold text-lg mt-1">₹{item.price.toLocaleString('en-IN')}</p>
                                    <div className="flex items-center gap-4 mt-2">
                                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                                            <button 
                                                onClick={() => dispatch(addToCart({ ...item, qty: Math.max(1, item.qty - 1) }))}
                                                className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold"
                                            >-</button>
                                            <span className="px-4 py-1 text-gray-800 font-semibold">{item.qty}</span>
                                            <button 
                                                onClick={() => dispatch(addToCart({ ...item, qty: Math.min(item.countInStock, item.qty + 1) }))}
                                                className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold"
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
                        <div className="bg-white rounded-3xl shadow-xl p-6 border border-blue-50 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-100">Order Summary</h2>
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-gray-600">
                                    <span>Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})</span>
                                    <span>₹{cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="text-green-600 font-semibold">FREE</span>
                                </div>
                                <div className="flex justify-between text-xl font-extrabold text-blue-900 pt-4 border-t border-gray-100">
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
