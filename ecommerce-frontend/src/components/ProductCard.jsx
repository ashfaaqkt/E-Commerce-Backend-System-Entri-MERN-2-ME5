import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../redux/slices/cartSlice';
import { FaShoppingCart, FaCheck, FaTrash } from 'react-icons/fa';
import { useState } from 'react';

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const { cartItems } = useSelector((state) => state.cart);
    const { darkMode } = useSelector((state) => state.theme);
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

    const handleRemoveFromCart = (e) => {
        e.stopPropagation();
        dispatch(removeFromCart(product._id));
    };

    return (
        <div className={`rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border flex flex-col relative group ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-blue-50'}`}>
            {/* Quick Delete Trash Icon if in cart */}
            {isInCart && (
                <button 
                    onClick={handleRemoveFromCart}
                    className="absolute top-3 right-3 z-10 p-2 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 scale-90 hover:scale-110"
                    title="Remove from Tray"
                >
                    <FaTrash size={12} />
                </button>
            )}

            {/* Image */}
            <div className={`h-48 flex items-center justify-center p-4 overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-r from-blue-50 to-white'}`}>
                {product.image && product.image !== 'no-photo.jpg' ? (
                    <img src={product.image} alt={product.name} className="object-contain h-full w-full transition-transform duration-300 hover:scale-105" />
                ) : (
                    <div className={`${darkMode ? 'text-gray-600' : 'text-blue-300'} font-semibold text-lg text-center`}>{product.name}</div>
                )}
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
                <span className={`text-xs py-0.5 px-2.5 rounded-full font-semibold w-fit mb-2 ${darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>{product.category}</span>
                <h3 className={`text-base font-bold line-clamp-1 mb-1 ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>{product.name}</h3>
                <p className={`text-sm line-clamp-2 flex-1 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>{product.description}</p>

                {/* Price + Cart Button */}
                <div className="mt-4 flex items-center justify-between gap-2">
                    <span className={`text-2xl font-extrabold ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>
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
