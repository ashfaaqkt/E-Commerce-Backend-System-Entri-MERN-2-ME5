import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RiSparkling2Fill } from 'react-icons/ri';
import { FaTimes, FaBoxOpen } from 'react-icons/fa';
import axiosInstance from '../api/axiosInstance';

const formatAnalysis = (text) => {
    return text.split('\n').map((line, i) => {
        if (!line.trim()) return null;
        return (
            <p key={i} className="mb-2 leading-relaxed">
                {line.split(/(\*\*.*?\*\*)/).map((part, j) =>
                    part.startsWith('**') && part.endsWith('**')
                        ? <strong key={j}>{part.slice(2, -2)}</strong>
                        : part
                )}
            </p>
        );
    });
};

const ProductInsightModal = ({ product, onClose }) => {
    const { darkMode } = useSelector((state) => state.theme);
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Auto-fetch on mount
    useState(() => {
        const fetchAnalysis = async () => {
            try {
                const res = await axiosInstance.post('/ai/analyze-product', {
                    name: product.name,
                    description: product.description,
                    category: product.category,
                    price: product.price,
                    stock: product.stock,
                });
                setAnalysis(res.data.analysis);
            } catch (err) {
                const errorMsg = err.response?.data?.error || 'Unable to analyze this product right now. Please try again.';
                setError(errorMsg);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalysis();
    }, []);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
            <div
                className={`relative w-full max-w-md rounded-3xl shadow-2xl border overflow-hidden ${
                    darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-blue-100'
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-700 to-purple-700 px-6 py-4 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                            <RiSparkling2Fill className="text-white text-xl" />
                        </div>
                        <div>
                            <p className="text-blue-100 text-xs font-medium">AI Product Analysis</p>
                            <h3 className="text-white font-bold text-sm leading-tight line-clamp-1">{product.name}</h3>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all flex-shrink-0 mt-0.5"
                    >
                        <FaTimes />
                    </button>
                </div>

                {/* Product mini-info */}
                <div className={`px-6 py-3 flex items-center gap-3 border-b ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                    {product.image && product.image !== 'no-photo.jpg' && (
                        <img
                            src={product.image}
                            alt={product.name}
                            className={`w-14 h-14 object-contain rounded-xl border ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}
                            onError={(e) => e.target.style.display = 'none'}
                        />
                    )}
                    <div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${darkMode ? 'bg-blue-900/40 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
                            {product.category}
                        </span>
                        <p className={`text-xl font-extrabold mt-1 ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>
                            ₹{product.price?.toLocaleString('en-IN')}
                        </p>
                    </div>
                </div>

                {/* Analysis Content */}
                <div className="px-6 py-5 max-h-64 overflow-y-auto">
                    {loading ? (
                        <div className="flex flex-col items-center gap-4 py-6">
                            <div className="relative w-14 h-14">
                                <div className="absolute inset-0 rounded-full border-4 border-blue-200 animate-spin border-t-blue-600"></div>
                                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                                    <RiSparkling2Fill className="text-white" />
                                </div>
                            </div>
                            <p className={`text-sm font-medium animate-pulse ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Analyzing with Gemini AI...
                            </p>
                        </div>
                    ) : error ? (
                        <div className={`text-center py-4 text-sm ${darkMode ? 'text-red-400' : 'text-red-500'}`}>
                            <FaBoxOpen className="text-3xl mx-auto mb-2 opacity-50" />
                            {error}
                        </div>
                    ) : (
                        <div className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {formatAnalysis(analysis)}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className={`px-6 py-3 border-t ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                    <p className={`text-center text-[10px] ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                        Analysis generated by Google Gemini AI
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProductInsightModal;
