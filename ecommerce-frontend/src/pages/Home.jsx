import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import ProductCard from '../components/ProductCard';
import { FaSearch, FaChevronDown, FaShoppingCart, FaCheck } from 'react-icons/fa';

const CATEGORIES = ['All', 'Electronics', 'Cameras', 'Laptops', 'Accessories', 'Headphones', 'Books', 'Clothes/Shoes', 'Beauty/Health', 'Sports', 'Home'];

const SORT_OPTIONS = [
    { label: '🆕 Newest', value: 'newest' },
    { label: '📅 Oldest', value: 'oldest' },
    { label: '💰 Price: Low → High', value: 'low' },
    { label: '💎 Price: High → Low', value: 'high' }
];

const CarouselCard = ({ product }) => {
    const dispatch = useDispatch();
    const { cartItems } = useSelector((state) => state.cart);
    const { darkMode } = useSelector((state) => state.theme);
    const [added, setAdded] = useState(false);
    const isInCart = cartItems.some((item) => item.product === product._id);

    const handleAdd = (e) => {
        e.stopPropagation();
        dispatch(addToCart({
            product: product._id,
            name: product.name,
            image: product.image,
            price: product.price,
            countInStock: product.stock,
            qty: 1,
        }));
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <div className="w-64 flex-shrink-0 px-3 py-6">
            <div className={`rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-blue-50'}`}>
                <div className={`h-40 flex items-center justify-center p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <img src={product.image} alt={product.name} className="h-full object-contain" />
                </div>
                <div className="p-4">
                    <h3 className={`text-sm font-bold truncate mb-1 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>{product.name}</h3>
                    <div className="flex items-center justify-between mt-3">
                        <span className={`text-lg font-black ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>₹{product.price.toLocaleString('en-IN')}</span>
                        <button
                            onClick={handleAdd}
                            className={`p-2 rounded-lg transition-all ${
                                added || isInCart ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                        >
                            {added || isInCart ? <FaCheck size={14} /> : <FaShoppingCart size={14} />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Home = () => {
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state.products);
    const { darkMode } = useSelector((state) => state.theme);

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

    // Top products for carousel
    const carouselProducts = (products || []).slice(0, 10);

    return (
        <div className="w-full space-y-8">
            {/* Hero Carousel */}
            {!loading && carouselProducts.length > 0 && (
                <div className={`relative group overflow-hidden rounded-3xl py-4 shadow-2xl transition-all duration-500 border-t ${darkMode ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-black border-gray-700' : 'bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 border-blue-400'}`}>
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none"></div>
                    <div className="relative z-10 px-10 pt-4 flex justify-between items-end">
                        <div className="text-white">
                            <h2 className="text-4xl font-black tracking-tighter uppercase italic drop-shadow-lg">Featured Drops</h2>
                        </div>
                        <div className="text-right hidden sm:block">
                            <span className={`text-[10px] font-bold uppercase tracking-widest border px-3 py-1 rounded-full backdrop-blur-md ${darkMode ? 'text-gray-400 border-gray-700 bg-gray-900/40' : 'text-blue-300 border-blue-500/30'}`}>Auto-Scroll Active</span>
                        </div>
                    </div>
                    
                    <div className="relative flex overflow-hidden">
                        <div className="animate-marquee flex">
                            {/* Duplicate items for infinite scroll */}
                            {[...carouselProducts, ...carouselProducts].map((product, idx) => (
                                <CarouselCard key={`${product._id}-${idx}`} product={product} />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Category Pills — center */}
            <div className="flex flex-wrap justify-center gap-2">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                            category === cat
                                ? (darkMode ? 'bg-blue-600 text-white border-blue-600' : 'bg-blue-700 text-white border-blue-700 shadow-md')
                                : (darkMode ? 'bg-gray-800 text-gray-400 border-gray-700 hover:text-white hover:border-blue-500' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-400 hover:text-blue-600')
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Search + Sort Bar */}
            <div className={`rounded-2xl shadow-sm p-3 border flex flex-col sm:flex-row gap-3 items-center transition-colors ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-blue-50'}`}>
                <form onSubmit={handleSearch} className="flex flex-1 gap-2 w-full">
                    <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        placeholder="Search products..."
                        className={`flex-1 px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800'}`}
                    />
                    <button type="submit" className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 flex items-center gap-2 transition-all text-sm">
                        <FaSearch /> Search
                    </button>
                </form>

                {/* Custom Sort Dropdown */}
                <div className="relative w-full sm:w-64" ref={sortRef}>
                    <button
                        onClick={() => setIsSortOpen(!isSortOpen)}
                        className={`w-full flex justify-between items-center px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium hover:border-blue-400 group ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}
                    >
                        <span>{SORT_OPTIONS.find(o => o.value === sort)?.label}</span>
                        <FaChevronDown className={`ml-2 text-gray-400 transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {isSortOpen && (
                        <div className={`absolute z-50 mt-2 w-full rounded-2xl shadow-2xl border overflow-hidden animate-in fade-in zoom-in duration-200 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-blue-50'}`}>
                            {SORT_OPTIONS.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        setSort(option.value);
                                        setIsSortOpen(false);
                                    }}
                                    className={`w-full text-left px-4 py-3 text-sm transition-all font-medium ${
                                        sort === option.value 
                                            ? (darkMode ? 'bg-blue-900 text-blue-300 font-bold' : 'bg-blue-50 text-blue-700 font-bold') 
                                            : (darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-blue-50')
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
                <p className={`text-xs font-medium px-1 ${darkMode ? 'text-gray-400' : 'text-white'}`}>
                    Showing <span className={`${darkMode ? 'text-blue-400' : 'text-blue-200'} font-bold`}>{filtered?.length || 0}</span> product{filtered?.length !== 1 ? 's' : ''}
                    {category !== 'All' && <span> in <span className={`${darkMode ? 'text-blue-400' : 'text-blue-200'} font-bold`}>{category}</span></span>}
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
