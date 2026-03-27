import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import { FaShoppingCart, FaCheck } from 'react-icons/fa';
import { useState } from 'react';

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const { cartItems } = useSelector((state) => state.cart);
    const [added, setAdded] = useState(false);

    const isInCart = cartItems.some((x) => x.product === product._id);

    const handleAddToCart = () => {
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
        <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-blue-50 flex flex-col">
            {/* Image */}
            <div className="h-48 bg-gradient-to-r from-blue-50 to-white flex items-center justify-center p-4 overflow-hidden">
                {product.image && product.image !== 'no-photo.jpg' ? (
                    <img src={product.image} alt={product.name} className="object-contain h-full w-full transition-transform duration-300 hover:scale-105" />
                ) : (
                    <div className="text-blue-300 font-semibold text-lg text-center">{product.name}</div>
                )}
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
                <span className="text-xs bg-blue-100 text-blue-700 py-0.5 px-2.5 rounded-full font-semibold w-fit mb-2">{product.category}</span>
                <h3 className="text-base font-bold text-gray-800 line-clamp-1 mb-1">{product.name}</h3>
                <p className="text-sm text-gray-400 line-clamp-2 flex-1">{product.description}</p>

                {/* Price + Cart Button */}
                <div className="mt-4 flex items-center justify-between gap-2">
                    <span className="text-2xl font-extrabold text-blue-700">
                        ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    <button
                        onClick={handleAddToCart}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${
                            added || isInCart
                                ? 'bg-green-500 text-white scale-95'
                                : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md hover:scale-105'
                        }`}
                    >
                        {added || isInCart ? <><FaCheck /> Added</> : <><FaShoppingCart /> Add</>}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
