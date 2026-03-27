import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/productSlice';
import ProductCard from '../components/ProductCard';
import { FaSearch } from 'react-icons/fa';

const CATEGORIES = ['All', 'Electronics', 'Cameras', 'Laptops', 'Accessories', 'Headphones', 'Books', 'Clothes/Shoes', 'Beauty/Health', 'Sports', 'Home'];

const Home = () => {
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state.products);

    const [keyword, setKeyword] = useState('');
    const [category, setCategory] = useState('All');
    const [sort, setSort] = useState('newest');

    useEffect(() => {
        dispatch(fetchProducts(''));
    }, [dispatch]);

    const handleSearch = (e) => {
        e.preventDefault();
        dispatch(fetchProducts(keyword));
    };

    // Client-side filter + sort
    const filtered = products
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

                <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="px-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white text-sm font-medium"
                >
                    <option value="newest">🆕 Newest</option>
                    <option value="oldest">📅 Oldest</option>
                    <option value="low">💰 Price: Low → High</option>
                    <option value="high">💎 Price: High → Low</option>
                </select>
            </div>

            {/* Results count */}
            {!loading && (
                <p className="text-xs text-gray-400 font-medium px-1">
                    Showing <span className="text-blue-700 font-bold">{filtered.length}</span> product{filtered.length !== 1 ? 's' : ''}
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
                    {filtered.length > 0 ? (
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
