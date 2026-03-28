import React, { useState, useEffect } from 'react';
import { FaChevronUp } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const ScrollToTop = ({ chatOpen }) => {
    const [isVisible, setIsVisible] = useState(false);
    const { darkMode } = useSelector((state) => state.theme);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <div className={`fixed z-50 transition-all duration-300 ${chatOpen ? 'bottom-[560px] left-8' : 'bottom-28 left-8'}`}>
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className={`p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 ${
                        darkMode
                            ? 'bg-blue-600 text-white hover:bg-blue-500'
                            : 'bg-blue-800 text-white hover:bg-blue-700'
                    }`}
                    title="Go to Top"
                >
                    <FaChevronUp className="text-xl" />
                </button>
            )}
        </div>
    );
};

export default ScrollToTop;
