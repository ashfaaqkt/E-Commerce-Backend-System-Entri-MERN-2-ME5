import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/productSlice';
import ProductCard from '../components/ProductCard';

const Home = () => {
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(fetchProducts(''));
    }, [dispatch]);

    return (
        <div className="w-full">
            <div className="text-center py-12 mb-8 bg-white bg-opacity-70 rounded-3xl shadow-sm backdrop-blur-sm border border-blue-100">
                <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-blue-500 mb-4">
                    Latest Products
                </h1>
                <p className="text-lg text-blue-600 font-medium">Discover our premium selection with elegant designs</p>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-700"></div>
                </div>
            ) : error ? (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md" role="alert">
                    <p className="font-bold">Error loading products</p>
                    <p>{error}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {products.length > 0 ? (
                        products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))
                    ) : (
                        <div className="col-span-full text-center text-gray-500 text-xl py-12">
                            No products found. Start by adding some in the backend!
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Home;
