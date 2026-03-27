import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FaBox, FaClock, FaCheckCircle, FaTruck, FaTimesCircle, FaBan, FaUndo } from 'react-icons/fa';
import axiosInstance from '../api/axiosInstance';

const Orders = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMyOrders = async () => {
            try {
                const { data } = await axiosInstance.get('/orders/myorders');
                setOrders(data.data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.error || 'Failed to fetch orders');
                setLoading(false);
            }
        };
        fetchMyOrders();
    }, []);

    const getStatusStep = (status) => {
        switch (status) {
            case 'Pending': return 0;
            case 'Confirmed': return 1;
            case 'Shipped': return 2;
            case 'Delivered': return 3;
            case 'Failed': return -1;
            case 'Cancelled': return -2;
            default: return 0;
        }
    };

    const cancelOrderHandler = async (id) => {
        if (window.confirm('Are you sure you want to cancel this order?')) {
            try {
                await axiosInstance.put(`/orders/${id}/cancel`);
                const { data } = await axiosInstance.get('/orders/myorders');
                setOrders(data.data);
            } catch (err) {
                alert(err.response?.data?.error || 'Cancellation failed');
            }
        }
    };

    const returnHandler = () => {
        alert('📦 Return Request: This is a DEMO feature for now. In a real app, this would start the return process.');
    };

    return (
        <div className="max-w-6xl mx-auto py-10 px-4">
            <h1 className="text-4xl font-extrabold text-blue-900 mb-10 flex items-center gap-3">
                <FaBox className="text-blue-600" /> My Orders
            </h1>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-700"></div>
                </div>
            ) : error ? (
                <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-200 font-semibold">{error}</div>
            ) : orders.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-blue-50">
                    <div className="text-6xl mb-6">📦</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">No orders yet</h2>
                    <p className="text-gray-500">You haven't placed any orders yet. Start shopping to see them here!</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {orders.slice().reverse().map((order) => (
                        <div key={order._id} className="bg-white rounded-3xl shadow-xl border border-blue-50 overflow-hidden transition hover:shadow-2xl">
                            {/* Order Header */}
                            <div className="bg-blue-50 px-8 py-4 flex flex-wrap justify-between items-center gap-4 border-b border-blue-100">
                                <div>
                                    <p className="text-xs text-blue-400 font-bold uppercase tracking-wider">Order ID</p>
                                    <p className="font-mono text-sm text-blue-900">#{order._id.substring(order._id.length - 12)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-blue-400 font-bold uppercase tracking-wider">Date</p>
                                    <p className="text-sm text-blue-900">{new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-blue-400 font-bold uppercase tracking-wider">Total</p>
                                    <p className="text-sm font-extrabold text-blue-900">₹{order.totalPrice.toLocaleString('en-IN')}</p>
                                </div>
                                <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${
                                    order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                    order.status === 'Failed' ? 'bg-red-100 text-red-700' :
                                    'bg-blue-100 text-blue-700'
                                }`}>
                                    {order.status || 'Pending'}
                                </div>
                            </div>

                            <div className="p-8">
                                {/* Tracking Stepper */}
                                <div className="mb-12 relative">
                                    {order.status === 'Failed' ? (
                                        <div className="flex items-center justify-center gap-4 text-red-600 bg-red-50 p-4 rounded-2xl border border-red-100">
                                            <FaTimesCircle size={24} />
                                            <span className="font-bold text-lg">Order Delivery Not Successful</span>
                                        </div>
                                    ) : order.status === 'Cancelled' ? (
                                        <div className="flex items-center justify-center gap-4 text-gray-500 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                            <FaBan size={24} />
                                            <span className="font-bold text-lg">Order Cancelled by User</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between w-full max-w-2xl mx-auto">
                                            <Step icon={<FaClock />} label="Pending" active={getStatusStep(order.status) >= 0} current={getStatusStep(order.status) === 0} />
                                            <Connector active={getStatusStep(order.status) >= 1} />
                                            <Step icon={<FaCheckCircle />} label="Confirmed" active={getStatusStep(order.status) >= 1} current={getStatusStep(order.status) === 1} />
                                            <Connector active={getStatusStep(order.status) >= 2} />
                                            <Step icon={<FaTruck />} label="Shipped" active={getStatusStep(order.status) >= 2} current={getStatusStep(order.status) === 2} />
                                            <Connector active={getStatusStep(order.status) >= 3} />
                                            <Step icon={<FaCheckCircle />} label="Delivered" active={getStatusStep(order.status) >= 3} current={getStatusStep(order.status) === 3} />
                                        </div>
                                    )}
                                </div>

                                {/* Order Items Summary */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 underline decoration-blue-200">
                                            Items Summary
                                        </h3>
                                        <div className="space-y-3">
                                            {order.orderItems.map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-3 text-sm text-gray-600">
                                                    <div className="w-10 h-10 bg-gray-50 rounded flex items-center justify-center overflow-hidden border">
                                                        <img src={item.image} alt={item.name} className="object-contain" />
                                                    </div>
                                                    <span className="flex-grow font-medium line-clamp-1">{item.name}</span>
                                                    <span className="font-bold">x{item.qty}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 underline decoration-blue-200">
                                            Shipping Detail
                                        </h3>
                                        <p className="text-sm text-gray-500 leading-relaxed">
                                            {order.shippingAddress.address}<br />
                                            {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                                            {order.shippingAddress.country}
                                        </p>
                                        <div className="mt-4 pt-4 border-t border-gray-200">
                                            <p className="text-xs text-gray-400 italic">Payment: Cash on Delivery (COD)</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Actions */}
                                <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap gap-4">
                                    {(order.status === 'Pending' || order.status === 'Confirmed') && (
                                        <button
                                            onClick={() => cancelOrderHandler(order._id)}
                                            className="flex items-center gap-2 px-6 py-2.5 bg-red-50 text-red-600 rounded-xl font-bold border border-red-100 hover:bg-red-100 transition shadow-sm"
                                        >
                                            <FaBan /> Cancel Order
                                        </button>
                                    )}
                                    {order.status === 'Delivered' && (
                                        <button
                                            onClick={returnHandler}
                                            className="flex items-center gap-2 px-6 py-2.5 bg-blue-50 text-blue-700 rounded-xl font-bold border border-blue-100 hover:bg-blue-100 transition shadow-sm"
                                        >
                                            <FaUndo /> Return Items (Demo)
                                        </button>
                                    )}
                                    {(order.status === 'Cancelled' || order.status === 'Failed') && (
                                        <div className="text-gray-400 text-sm italic font-medium">
                                            This order is no longer active.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const Step = ({ icon, label, active, current }) => (
    <div className="flex flex-col items-center relative z-10">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
            active ? (current ? 'bg-blue-600 text-white scale-125 shadow-lg' : 'bg-green-500 text-white') : 'bg-gray-200 text-gray-400'
        }`}>
            {icon}
        </div>
        <span className={`text-[10px] sm:text-xs mt-2 font-bold uppercase tracking-tighter ${active ? 'text-gray-800' : 'text-gray-300'}`}>
            {label}
        </span>
    </div>
);

const Connector = ({ active }) => (
    <div className="flex-grow h-1 bg-gray-200 mx-[-4px] mb-4">
        <div className={`h-full bg-green-500 transition-all duration-1000 ease-in-out ${active ? 'w-full' : 'w-0'}`}></div>
    </div>
);

export default Orders;
