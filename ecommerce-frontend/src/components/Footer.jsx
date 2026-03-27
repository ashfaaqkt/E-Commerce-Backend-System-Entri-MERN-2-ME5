import React from 'react';
import { useSelector } from 'react-redux';
import { FaShoppingBasket } from 'react-icons/fa';

const Footer = () => {
    const { darkMode } = useSelector((state) => state.theme);

    return (
        <footer className={`py-8 mt-12 transition-all duration-300 ${
            darkMode 
                ? 'bg-gray-900/80 backdrop-blur-md border-t border-white/5 text-gray-400' 
                : 'bg-blue-900 text-white bg-opacity-95'
        }`}>
            <div className="container mx-auto px-4 text-center">
                <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-blue-100' : 'text-white'}`}>Entri Elevate - MERN - 2026 - ME5</h3>
                <p className={`${darkMode ? 'text-gray-500' : 'text-blue-200'} mb-2`}>Practice and Education Purpose</p>
                <p className="text-gray-400 text-sm">Devloped By: Ashfaaq Feroz Muhammad</p>
                <div className="mt-6 text-sm text-gray-500 flex items-center justify-center gap-1">
                    &copy; {new Date().getFullYear()} <FaShoppingBasket className="inline" /> <span className="font-bold">Basket</span>. All Rights Reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
