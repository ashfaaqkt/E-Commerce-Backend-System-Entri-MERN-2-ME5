import React from 'react';
import { useSelector } from 'react-redux';
import { FaShoppingBasket } from 'react-icons/fa';

const Footer = () => {
    const { darkMode } = useSelector((state) => state.theme);

    return (
        <footer className={`py-8 mt-12 transition-all duration-300 rounded-t-3xl ${darkMode
            ? 'bg-gray-900/80 backdrop-blur-md border-t border-white/5 text-gray-400'
            : 'bg-blue-900 text-white bg-opacity-95'
            }`}>
            <div className="container mx-auto px-6 text-center">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/10 pb-6 mb-6">
                    <div className="flex items-center gap-2">
                        <FaShoppingBasket className={`text-3xl ${darkMode ? 'text-blue-400' : 'text-blue-200'}`} />
                        <span className={`text-2xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-white'}`}>Basket</span>
                    </div>
                    <div className="text-sm">
                        <h3 className={`font-bold mb-1 ${darkMode ? 'text-blue-100' : 'text-white'}`}>Entri Elevate - MERN</h3>
                        <p className={`${darkMode ? 'text-gray-500' : 'text-blue-200'}`}>ME5 Assesment - 2026</p>
                    </div>
                </div>

                <p className={`${darkMode ? 'text-gray-400' : 'text-blue-100'} text-sm mb-4`}>Developed By: <span className="font-semibold">Ashfaaq Feroz Muhammad</span></p>
                <p className={`${darkMode ? 'text-gray-500' : 'text-blue-300'} text-xs mb-6 italic`}>Practice and Education Purpose Only</p>

                <div className="text-xs text-gray-500 flex flex-wrap items-center justify-center gap-2 pt-4 border-t border-white/5">
                    &copy; {new Date().getFullYear()} <span className="font-bold">Basket</span>. All Rights Reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
