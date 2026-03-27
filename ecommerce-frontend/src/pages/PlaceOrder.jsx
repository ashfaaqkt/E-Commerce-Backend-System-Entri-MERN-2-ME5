import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaTruck, FaMoneyBillWave, FaBoxOpen, FaClipboardCheck } from 'react-icons/fa';
import axiosInstance from '../api/axiosInstance';
import { clearCart } from '../redux/slices/cartSlice';

const PlaceOrder = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);
    const { userInfo } = useSelector((state) => state.auth);
    const { darkMode } = useSelector((state) => state.theme);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isOrderPlaced, setIsOrderPlaced] = useState(false);

    const shippingAddress = JSON.parse(localStorage.getItem('shippingAddress')) || {};

    const itemsPrice = cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const shippingPrice = itemsPrice > 5000 ? 0 : 500;
    const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
    const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2);

    useEffect(() => {
        if (isOrderPlaced) return; // Don't redirect if we just ordered
        
        if (!shippingAddress.address) {
            navigate('/shipping');
        } else if (cart.cartItems.length === 0) {
            navigate('/cart');
        }
    }, [shippingAddress.address, cart.cartItems.length, navigate, isOrderPlaced]);

    const placeOrderHandler = async () => {
        try {
            setLoading(true);
            const { data } = await axiosInstance.post('/orders', {
                orderItems: cart.cartItems,
                shippingAddress,
                paymentMethod: 'CashOnDelivery',
                itemsPrice,
                shippingPrice,
                taxPrice,
                totalPrice,
            });
            setIsOrderPlaced(true);
            dispatch(clearCart());
            navigate(`/order-confirmation/${data.data._id}`);
        } catch (err) {
            setError(err.response?.data?.error || 'Order creation failed');
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            <h1 className={`text-4xl font-extrabold mb-8 ${darkMode ? 'text-white' : 'text-blue-900'}`}>Order Summary</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Shipping info */}
                    <div className={`rounded-3xl shadow-md p-6 border transition-colors ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-blue-50'}`}>
                        <div className="flex justify-between items-center mb-4">
                            <h2 className={`text-xl font-bold flex items-center gap-2 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                                <FaTruck className={darkMode ? 'text-blue-400' : 'text-blue-500'} /> Shipping Address
                            </h2>
                            <Link to="/shipping" className={`text-sm font-bold hover:underline ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>Edit</Link>
                        </div>
                        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                            <strong className={darkMode ? 'text-gray-300' : 'text-gray-900'}>Address: </strong>
                            {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}
                        </p>
                        <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            <strong className={darkMode ? 'text-gray-300' : 'text-gray-900'}>Phone: </strong>
                            {shippingAddress.phone}
                        </p>
                    </div>

                    {/* Payment info */}
                    <div className={`rounded-3xl shadow-md p-6 border transition-colors ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-blue-50'}`}>
                        <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                            <FaMoneyBillWave className={darkMode ? 'text-blue-400' : 'text-blue-500'} /> Payment Method
                        </h2>
                        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                            <strong className={darkMode ? 'text-gray-300' : 'text-gray-900'}>Method: </strong> Cash on Delivery (COD)
                        </p>
                    </div>

                    {/* Items info */}
                    <div className={`rounded-3xl shadow-md p-6 border transition-colors ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-blue-50'}`}>
                        <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
                            <FaBoxOpen className={darkMode ? 'text-blue-400' : 'text-blue-500'} /> Order Items
                        </h2>
                        <div className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
                            {cart.cartItems.map((item, index) => (
                                <div key={index} className="py-4 flex items-center gap-4">
                                    <div className={`w-16 h-16 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 ${darkMode ? 'bg-gray-700 border border-gray-600' : 'bg-blue-50'}`}>
                                        <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                    </div>
                                    <div className="flex-grow">
                                        <h4 className={`font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>{item.name}</h4>
                                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.qty} x ₹{item.price.toLocaleString('en-IN')} = <span className="font-bold text-blue-400">₹{(item.qty * item.price).toLocaleString('en-IN')}</span></p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Totals info */}
                <div className="lg:col-span-1">
                    <div className={`rounded-3xl shadow-xl p-8 border sticky top-24 transition-colors ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-blue-50'}`}>
                        <h2 className={`text-xl font-bold mb-6 pb-4 border-b ${darkMode ? 'text-gray-100 border-gray-700' : 'text-gray-800 border-gray-100'}`}>Price Details</h2>
                        <div className="space-y-4 mb-8">
                            <div className={`flex justify-between font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                <span>Subtotal</span>
                                <span className={darkMode ? 'text-gray-200' : 'text-gray-800'}>₹{itemsPrice.toLocaleString('en-IN')}</span>
                            </div>
                            <div className={`flex justify-between font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                <span>Shipping Fees</span>
                                <span>{shippingPrice === 0 ? <span className="text-green-500 font-bold text-sm tracking-widest">FREE</span> : `₹${shippingPrice.toLocaleString('en-IN')}`}</span>
                            </div>
                            <div className={`flex justify-between font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                <span>Tax (15% GST)</span>
                                <span className={darkMode ? 'text-gray-200' : 'text-gray-800'}>₹{taxPrice.toLocaleString('en-IN')}</span>
                            </div>
                            <div className={`flex justify-between text-2xl font-extrabold pt-4 border-t ${darkMode ? 'text-blue-400 border-gray-700' : 'text-blue-900 border-gray-100'}`}>
                                <span>Total Price</span>
                                <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                            </div>
                        </div>

                        {error && <div className="mb-4 bg-red-50 p-3 rounded-xl border border-red-200 text-red-600 text-sm font-semibold">{error}</div>}

                        <button
                            onClick={placeOrderHandler}
                            disabled={loading}
                            className={`w-full bg-blue-700 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-blue-800 transition flex items-center justify-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? (
                                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            ) : (
                                <><FaClipboardCheck /> Confirm Order (COD)</>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaceOrder;
