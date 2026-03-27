import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-50">
            <Link to={`/product/${product._id}`}>
                {/* Simulated Image Box since we don't have real images yet */}
                <div className="h-48 bg-gradient-to-r from-blue-100 to-white flex items-center justify-center p-4">
                    {product.image && product.image !== 'no-photo.jpg' ? (
                        <img src={product.image} alt={product.name} className="object-contain h-full w-full" />
                    ) : (
                        <div className="text-blue-400 font-semibold text-lg">{product.name}</div>
                    )}
                </div>
            </Link>
            <div className="p-5">
                <Link to={`/product/${product._id}`}>
                    <h3 className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors line-clamp-1">{product.name}</h3>
                </Link>
                <p className="mt-2 text-sm text-gray-500 line-clamp-2">{product.description}</p>
                <div className="mt-4 flex items-center justify-between">
                    <span className="text-2xl font-extrabold text-blue-700">${product.price.toFixed(2)}</span>
                    <span className="text-sm bg-blue-100 text-blue-800 py-1 px-3 rounded-full font-medium">{product.category}</span>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
