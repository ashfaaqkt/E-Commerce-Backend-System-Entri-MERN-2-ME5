import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaCheckCircle, FaClipboardList, FaHome, FaBox, FaCreditCard } from 'react-icons/fa';
import axiosInstance from '../api/axiosInstance';

const OrderConfirmation = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const { darkMode } = useSelector((state) => state.theme);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const { data } = await axiosInstance.get(`/orders/${id}`);
                setOrder(data.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching order:', err);
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-700"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="max-w-2xl mx-auto py-20 px-4 text-center">
                <h1 className="text-2xl font-bold text-red-600">Order not found</h1>
                <Link to="/" className="text-blue-600 underline mt-4 inline-block">Back to Shopping</Link>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto py-12 px-4 text-center">
            <div className={`rounded-3xl shadow-2xl p-8 md:p-12 border transition-colors ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-blue-50'}`}>
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce ${darkMode ? 'bg-green-900/20 text-green-400' : 'bg-green-100 text-green-600'}`}>
                    <FaCheckCircle size={40} />
                </div>
                
                <h1 className={`text-3xl md:text-4xl font-extrabold mb-2 ${darkMode ? 'text-white' : 'text-blue-900'}`}>Order Placed!</h1>
                <p className={`mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Thank you, <span className={`font-bold ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>{order.user?.name}</span>. Your order has been successfully placed.
                </p>

                <div className={`rounded-2xl p-6 mb-8 border text-left ${darkMode ? 'bg-gray-900/50 border-gray-700' : 'bg-blue-50 border-blue-100'}`}>
                    <div className={`flex justify-between items-center mb-4 pb-4 border-b ${darkMode ? 'border-gray-700' : 'border-blue-200'}`}>
                        <div>
                            <span className={`text-[10px] font-bold uppercase tracking-wider block ${darkMode ? 'text-blue-500' : 'text-blue-400'}`}>Order ID</span>
                            <span className={`font-mono font-bold ${darkMode ? 'text-blue-300' : 'text-blue-900'}`}>#{order._id.substring(order._id.length - 12)}</span>
                        </div>
                        <div className="text-right">
                            <span className={`text-[10px] font-bold uppercase tracking-wider block ${darkMode ? 'text-blue-500' : 'text-blue-400'}`}>Status</span>
                            <span className={`bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tighter`}>
                                {order.status || 'Pending'}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-4 mb-6">
                        <h3 className={`text-sm font-bold flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-blue-800'}`}>
                            <FaBox className={darkMode ? 'text-blue-500' : 'text-blue-400'} /> Items Summary
                        </h3>
                        {order.orderItems.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm">
                                <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{item.name} <span className={`text-xs font-bold ${darkMode ? 'text-blue-400' : 'text-blue-500'}`}>x{item.qty}</span></span>
                                <span className={`font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
                            </div>
                        ))}
                    </div>

                    <div className={`pt-4 border-t border-dashed flex justify-between items-center ${darkMode ? 'border-gray-700' : 'border-blue-300'}`}>
                        <span className={`text-lg font-bold ${darkMode ? 'text-gray-300' : 'text-blue-900'}`}>Total Charged</span>
                        <span className={`text-2xl font-extrabold ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>₹{order.totalPrice.toLocaleString('en-IN')}</span>
                    </div>

                    <div className={`mt-4 pt-4 border-t grid grid-cols-2 gap-4 ${darkMode ? 'border-gray-800' : 'border-blue-100'}`}>
                        <div>
                            <span className={`text-[10px] font-bold uppercase block ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Payment Method</span>
                            <span className={`text-xs font-semibold flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                <FaCreditCard size={10} /> Cash on Delivery (COD)
                            </span>
                        </div>
                        <div>
                            <span className={`text-[10px] font-bold uppercase block ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Shipping to</span>
                            <span className={`text-xs font-semibold truncate ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{order.shippingAddress.city}, {order.shippingAddress.country}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link
                        to="/orders"
                        className={`flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold transition ${darkMode ? 'bg-gray-700 text-blue-400 hover:bg-gray-600' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`}
                    >
                        <FaClipboardList /> Track My Order
                    </Link>
                    <Link
                        to="/"
                        className="flex items-center justify-center gap-2 bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg"
                    >
                        <FaHome /> Continue Shopping
                    </Link>
                </div>
            </div>
            <p className="mt-6 text-center text-gray-400 text-xs italic">
                A confirmation message has been sent to your dashboard notifications.
            </p>
        </div>
    );
};

export default OrderConfirmation;
