import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { FaPlus, FaBoxOpen, FaClipboardList, FaEdit, FaTrash, FaTimes, FaSave, FaTruck, FaCheck } from 'react-icons/fa';

const CATEGORIES = ['Electronics', 'Cameras', 'Laptops', 'Accessories', 'Headphones', 'Food', 'Books', 'Clothes/Shoes', 'Beauty/Health', 'Sports', 'Outdoor', 'Home'];
const EMPTY_FORM = { name: '', description: '', price: '', category: 'Electronics', stock: '', image: '' };

const AdminDashboard = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const [tab, setTab] = useState('products');
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [form, setForm] = useState(EMPTY_FORM);
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Edit modal state
    const [editingProduct, setEditingProduct] = useState(null);
    const [editForm, setEditForm] = useState(EMPTY_FORM);
    const [editError, setEditError] = useState('');
    const [editSubmitting, setEditSubmitting] = useState(false);

    // Delete confirmation
    const [deletingId, setDeletingId] = useState(null);
    const [deleteSubmitting, setDeleteSubmitting] = useState(false);

    useEffect(() => {
        if (!userInfo || userInfo.role !== 'admin') navigate('/');
    }, [userInfo, navigate]);

    useEffect(() => { fetchProducts(); fetchOrders(); }, []);

    const fetchProducts = async () => {
        try {
            const res = await axiosInstance.get('/products');
            setProducts(res.data.data || []);
        } catch (e) { console.error(e); }
    };

    const fetchOrders = async () => {
        try {
            const res = await axiosInstance.get('/orders/all');
            setOrders(res.data.data || []);
        } catch (e) { console.error(e); }
    };

    // --- Add Product ---
    const handleAddProduct = async (e) => {
        e.preventDefault();
        setSubmitting(true); setFormError(''); setFormSuccess('');
        try {
            await axiosInstance.post('/products', { ...form, price: Number(form.price), stock: Number(form.stock) });
            setFormSuccess('✅ Product added successfully!');
            setForm(EMPTY_FORM);
            fetchProducts();
        } catch (err) {
            setFormError(err.response?.data?.error || 'Failed to add product');
        } finally { setSubmitting(false); }
    };

    // --- Edit Product ---
    const openEdit = (product) => {
        setEditingProduct(product);
        setEditForm({ name: product.name, description: product.description, price: product.price, category: product.category, stock: product.stock, image: product.image || '' });
        setEditError('');
    };

    const handleEditProduct = async (e) => {
        e.preventDefault();
        setEditSubmitting(true); setEditError('');
        try {
            await axiosInstance.put(`/products/${editingProduct._id}`, { ...editForm, price: Number(editForm.price), stock: Number(editForm.stock) });
            setEditingProduct(null);
            fetchProducts();
        } catch (err) {
            setEditError(err.response?.data?.error || 'Failed to update product');
        } finally { setEditSubmitting(false); }
    };

    // --- Delete Product ---
    const handleDelete = async () => {
        setDeleteSubmitting(true);
        try {
            await axiosInstance.delete(`/products/${deletingId}`);
            setDeletingId(null);
            fetchProducts();
        } catch (err) { console.error(err); }
        finally { setDeleteSubmitting(false); }
    };

    // --- Update Order Status ---
    const updateStatus = async (orderId, newStatus) => {
        try {
            await axiosInstance.put(`/orders/${orderId}/status`, { status: newStatus });
            fetchOrders();
        } catch (err) { console.error(err); }
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl p-8 mb-6 border border-blue-50">
                <h1 className="text-3xl font-extrabold text-blue-900 mb-1">Admin Dashboard</h1>
                <p className="text-blue-400 font-medium">Welcome, {userInfo?.name}</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-3 mb-6 flex-wrap">
                {[['products', <><FaBoxOpen /> Products ({products.length})</>], ['add', <><FaPlus /> Add Product</>], ['orders', <><FaClipboardList /> Orders ({orders.length})</>]].map(([key, label]) => (
                    <button key={key} onClick={() => setTab(key)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${tab === key ? 'bg-blue-700 text-white shadow-lg' : 'bg-white text-blue-700 border border-blue-200 hover:bg-blue-50'}`}>
                        {label}
                    </button>
                ))}
            </div>

            {/* Product List Tab */}
            {tab === 'products' && (
                <div className="bg-white rounded-2xl shadow-md p-6 border border-blue-50 overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-blue-700 border-b border-blue-100">
                                <th className="pb-3 pr-4">Product</th>
                                <th className="pb-3 pr-4">Category</th>
                                <th className="pb-3 pr-4">Price (₹)</th>
                                <th className="pb-3 pr-4">Stock</th>
                                <th className="pb-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((p) => (
                                <tr key={p._id} className="border-b border-gray-50 hover:bg-blue-50 transition">
                                    <td className="py-3 pr-4">
                                        <div className="flex items-center gap-3">
                                            {p.image && <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-lg border border-gray-200" onError={(e) => e.target.style.display='none'} />}
                                            <span className="font-semibold text-gray-800">{p.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 pr-4 text-gray-500">{p.category}</td>
                                    <td className="py-3 pr-4 text-blue-700 font-bold">₹{p.price.toLocaleString('en-IN')}</td>
                                    <td className="py-3 pr-4 text-gray-600">{p.stock}</td>
                                    <td className="py-3">
                                        <div className="flex gap-2 justify-center">
                                            <button onClick={() => openEdit(p)}
                                                className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-semibold transition text-xs">
                                                <FaEdit /> Edit
                                            </button>
                                            <button onClick={() => setDeletingId(p._id)}
                                                className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 font-semibold transition text-xs">
                                                <FaTrash /> Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {products.length === 0 && <p className="text-center text-gray-400 py-8">No products yet.</p>}
                </div>
            )}

            {/* Add Product Tab */}
            {tab === 'add' && (
                <div className="bg-white rounded-2xl shadow-md p-8 border border-blue-50">
                    <h2 className="text-xl font-bold text-blue-900 mb-6">Add New Product</h2>
                    {formError && <div className="mb-4 bg-red-50 p-3 rounded-xl border border-red-200 text-red-600 text-sm font-semibold">{formError}</div>}
                    {formSuccess && <div className="mb-4 bg-green-50 p-3 rounded-xl border border-green-200 text-green-700 text-sm font-semibold">{formSuccess}</div>}
                    <ProductForm form={form} setForm={setForm} onSubmit={handleAddProduct} submitting={submitting} submitLabel="Add Product" categories={CATEGORIES} />
                </div>
            )}

            {/* Orders Tab */}
            {tab === 'orders' && (
                <div className="bg-white rounded-2xl shadow-md p-6 border border-blue-50 overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-blue-700 border-b border-blue-100">
                                <th className="pb-3 pr-4">Order ID</th>
                                <th className="pb-3 pr-4">Customer</th>
                                <th className="pb-3 pr-4">Items</th>
                                <th className="pb-3 pr-4">Total (₹)</th>
                                <th className="pb-3 pr-4">Status</th>
                                <th className="pb-3 text-center">Update Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.reverse().map((o) => (
                                <tr key={o._id} className="border-b border-gray-50 hover:bg-blue-50 transition">
                                    <td className="py-3 pr-4 text-xs text-gray-400 font-mono">{o._id.substring(0,12)}...</td>
                                    <td className="py-3 pr-4">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-gray-700">{o.user?.name || 'N/A'}</span>
                                            <span className="text-[10px] text-gray-400">{o.user?.email || ''}</span>
                                        </div>
                                    </td>
                                    <td className="py-3 pr-4 text-gray-700">{o.orderItems?.length} item(s)</td>
                                    <td className="py-3 pr-4 text-blue-700 font-bold">₹{o.totalPrice?.toLocaleString('en-IN')}</td>
                                    <td className="py-3 pr-4">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                            o.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                            o.status === 'Failed' ? 'bg-red-100 text-red-700' :
                                            o.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                                            o.status === 'Confirmed' ? 'bg-purple-100 text-purple-700' :
                                            'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {o.status || 'Pending'}
                                        </span>
                                    </td>
                                    <td className="py-3">
                                        <div className="flex gap-1 justify-center">
                                            {o.status === 'Pending' && (
                                                <button onClick={() => updateStatus(o._id, 'Confirmed')} title="Confirm" className="p-1.5 bg-purple-50 text-purple-600 rounded hover:bg-purple-100"><FaCheck size={12} /></button>
                                            )}
                                            {(o.status === 'Pending' || o.status === 'Confirmed') && (
                                                <button onClick={() => updateStatus(o._id, 'Shipped')} title="Ship" className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"><FaTruck size={12} /></button>
                                            )}
                                            {o.status === 'Shipped' && (
                                                <button onClick={() => updateStatus(o._id, 'Delivered')} title="Deliver" className="p-1.5 bg-green-50 text-green-600 rounded hover:bg-green-100"><FaCheck size={12} /></button>
                                            )}
                                            {o.status !== 'Delivered' && o.status !== 'Failed' && (
                                                <button onClick={() => updateStatus(o._id, 'Failed')} title="Mark Failed" className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100"><FaTimes size={12} /></button>
                                            )}
                                            {o.status === 'Delivered' && <span className="text-xs text-green-500 font-bold">COMPLETED</span>}
                                            {o.status === 'Failed' && <span className="text-xs text-red-500 font-bold">FAILED</span>}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {orders.length === 0 && <p className="text-center text-gray-400 py-8">No orders yet.</p>}
                </div>
            )}

            {/* ─── Edit Modal ─── */}
            {editingProduct && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-blue-900">Edit Product</h2>
                            <button onClick={() => setEditingProduct(null)} className="text-gray-400 hover:text-gray-600 transition">
                                <FaTimes size={20} />
                            </button>
                        </div>
                        {editError && <div className="mb-4 bg-red-50 p-3 rounded-xl border border-red-200 text-red-600 text-sm font-semibold">{editError}</div>}
                        <ProductForm form={editForm} setForm={setEditForm} onSubmit={handleEditProduct} submitting={editSubmitting} submitLabel="Save Changes" submitIcon={<FaSave />} categories={CATEGORIES} />
                    </div>
                </div>
            )}

            {/* ─── Delete Confirm Modal ─── */}
            {deletingId && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm text-center">
                        <div className="text-5xl mb-4">🗑️</div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Delete Product?</h2>
                        <p className="text-gray-500 mb-6 text-sm">This action cannot be undone. The product will be permanently removed from the database.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeletingId(null)} className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-600 font-semibold hover:bg-gray-50 transition">
                                Cancel
                            </button>
                            <button onClick={handleDelete} disabled={deleteSubmitting}
                                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition flex items-center justify-center gap-2">
                                {deleteSubmitting ? <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : <FaTrash />}
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Reusable product form component
const ProductForm = ({ form, setForm, onSubmit, submitting, submitLabel, submitIcon, categories }) => (
    <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
            <label className="text-sm font-bold text-gray-700 mb-1 block">Product Title</label>
            <input name="name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required placeholder="e.g. Samsung Galaxy S25" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
        </div>
        <div className="md:col-span-2">
            <label className="text-sm font-bold text-gray-700 mb-1 block">Description</label>
            <textarea name="description" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} required rows={3} placeholder="Describe the product..." className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none" />
        </div>
        <div>
            <label className="text-sm font-bold text-gray-700 mb-1 block">Price (₹ INR)</label>
            <input name="price" type="number" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} required min="1" placeholder="e.g. 49999" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
        </div>
        <div>
            <label className="text-sm font-bold text-gray-700 mb-1 block">Stock</label>
            <input name="stock" type="number" value={form.stock} onChange={(e) => setForm({...form, stock: e.target.value})} required min="0" placeholder="e.g. 50" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
        </div>
        <div>
            <label className="text-sm font-bold text-gray-700 mb-1 block">Category</label>
            <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white">
                {categories.map(c => <option key={c}>{c}</option>)}
            </select>
        </div>
        <div>
            <label className="text-sm font-bold text-gray-700 mb-1 block">Image URL</label>
            <input value={form.image} onChange={(e) => setForm({...form, image: e.target.value})} placeholder="https://..." className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
        </div>
        {form.image && (
            <div className="md:col-span-2">
                <p className="text-xs text-gray-500 mb-1">Image Preview:</p>
                <img src={form.image} alt="preview" className="h-24 object-contain rounded-lg border border-gray-200" onError={(e) => e.target.style.display='none'} />
            </div>
        )}
        <div className="md:col-span-2">
            <button type="submit" disabled={submitting}
                className={`w-full py-3 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-2 transition-all ${submitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 shadow-lg hover:shadow-xl'}`}>
                {submitting ? <><svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Saving...</> : <>{submitIcon || <FaPlus />} {submitLabel}</>}
            </button>
        </div>
    </form>
);

export default AdminDashboard;
