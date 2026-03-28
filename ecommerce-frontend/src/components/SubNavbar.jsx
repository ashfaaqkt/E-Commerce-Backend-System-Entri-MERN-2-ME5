import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCategory } from '../redux/slices/productSlice';

export const CATEGORIES = ['All', 'Electronics', 'Cameras', 'Laptops', 'Accessories', 'Headphones', 'Books', 'Clothes/Shoes', 'Beauty/Health', 'Sports', 'Home'];

const SubNavbar = () => {
    const dispatch = useDispatch();
    const { category: selectedCategory } = useSelector((state) => state.products);
    const { darkMode } = useSelector((state) => state.theme);

    return (
        <div className={`w-full sticky top-[72px] z-40 transition-colors duration-500 rounded-b-3xl ${
            darkMode 
                ? 'bg-black/80 border-b border-gray-800' 
                : 'bg-white/90 border-b border-blue-50 shadow-sm'
        } backdrop-blur-md`}>
            <div className="container mx-auto px-4 py-2 overflow-x-auto scrollbar-hide">
                <div className="flex items-center justify-start md:justify-center gap-2 min-w-max pb-1">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => dispatch(setCategory(cat))}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 border ${
                                selectedCategory === cat
                                    ? (darkMode ? 'bg-blue-600 text-white border-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'bg-blue-700 text-white border-blue-700 shadow-md')
                                    : (darkMode ? 'bg-gray-800/50 text-gray-400 border-gray-700 hover:text-white hover:border-blue-500' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-400 hover:text-blue-600')
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SubNavbar;
