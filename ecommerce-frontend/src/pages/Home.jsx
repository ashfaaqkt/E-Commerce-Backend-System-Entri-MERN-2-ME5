import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/productSlice';
import ProductCard from '../components/ProductCard';
import { FaSearch, FaChevronDown } from 'react-icons/fa';

const CATEGORIES = ['All', 'Electronics', 'Cameras', 'Laptops', 'Accessories', 'Headphones', 'Books', 'Clothes/Shoes', 'Beauty/Health', 'Sports', 'Home'];

const SORT_OPTIONS = [
    { label: '🆕 Newest', value: 'newest' },
    { label: '📅 Oldest', value: 'oldest' },
    { label: '💰 Price: Low → High', value: 'low' },
    { label: '💎 Price: High → Low', value: 'high' }
];

const Home = () => {
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state.products);

    const [keyword, setKeyword] = useState('');
    const [category, setCategory] = useState('All');
    const [sort, setSort] = useState('newest');
    const [isSortOpen, setIsSortOpen] = useState(false);
    const sortRef = useRef(null);

    useEffect(() => {
        dispatch(fetchProducts(''));
        
        const handleClickOutside = (e) => {
            if (sortRef.current && !sortRef.current.contains(e.target)) {
                setIsSortOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [dispatch]);

    const handleSearch = (e) => {
        e.preventDefault();
        dispatch(fetchProducts(keyword));
    };

    // Client-side filter + sort
    const filtered = (products || [])
        .filter(p => category === 'All' || p.category === category)
        .sort((a, b) => {
            if (sort === 'low') return a.price - b.price;
            if (sort === 'high') return b.price - a.price;
            if (sort === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

    return (
        <div className="w-full space-y-5">
            {/* Hero */}
            <div className="text-center py-10 bg-white bg-opacity-70 rounded-3xl shadow-sm backdrop-blur-sm border border-blue-100">
                <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-blue-500 mb-3">
                    Shop Premium Products
                </h1>
                <p className="text-blue-500 font-medium text-lg">Discover 18+ curated products — prices in ₹ INR</p>
            </div>

            {/* Category Pills — top left */}
            <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                            category === cat
                                ? 'bg-blue-700 text-white border-blue-700 shadow-md'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400 hover:text-blue-600'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Search + Sort Bar */}
            <div className="bg-white rounded-2xl shadow-sm p-3 border border-blue-50 flex flex-col sm:flex-row gap-3 items-center">
                <form onSubmit={handleSearch} className="flex flex-1 gap-2 w-full">
                    <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="Search products..."
                        className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                    />
                    <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 flex items-center gap-2 transition-all text-sm">
                        <FaSearch /> Search
                    </button>
                </form>

                {/* Custom Sort Dropdown */}
                <div className="relative w-full sm:w-64" ref={sortRef}>
                    <button
                        onClick={() => setIsSortOpen(!isSortOpen)}
                        className="w-full flex justify-between items-center px-4 py-2.5 bg-white rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium hover:border-blue-400 group"
                    >
                        <span>{SORT_OPTIONS.find(o => o.value === sort)?.label}</span>
                        <FaChevronDown className={`ml-2 text-gray-400 transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {isSortOpen && (
                        <div className="absolute z-50 mt-2 w-full bg-white rounded-2xl shadow-2xl border border-blue-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                            {SORT_OPTIONS.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        setSort(option.value);
                                        setIsSortOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-3 text-sm transition-all hover:bg-blue-50 font-medium ${
                                        sort === option.value ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-700'
                                    }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Results count */}
            {!loading && (
                <p className="text-xs text-gray-400 font-medium px-1">
                    Showing <span className="text-blue-700 font-bold">{filtered?.length || 0}</span> product{filtered?.length !== 1 ? 's' : ''}
                    {category !== 'All' && <span> in <span className="text-blue-700 font-bold">{category}</span></span>}
                </p>
            )}

            {/* Product Grid */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-700"></div>
                </div>
            ) : error ? (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md">
                    <p className="font-bold">Error loading products</p>
                    <p>{error}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filtered && filtered.length > 0 ? (
                        filtered.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))
                    ) : (
                        <div className="col-span-full text-center text-gray-400 text-xl py-12">
                            No products found. Try a different search or filter.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Home;
