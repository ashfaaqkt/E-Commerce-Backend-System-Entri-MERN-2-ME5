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
        <div
            className={`fixed z-[40] left-8 w-14 flex justify-center transition-all duration-300 ${chatOpen ? 'bottom-[660px]' : 'bottom-24'}`}
        >
            {isVisible && (
                <button
                    type="button"
                    onClick={scrollToTop}
                    className={`w-14 h-14 shrink-0 flex items-center justify-center rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 ${
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
