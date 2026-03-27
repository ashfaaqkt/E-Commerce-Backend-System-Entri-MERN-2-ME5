import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-blue-900 text-white py-8 mt-12 bg-opacity-95">
            <div className="container mx-auto px-4 text-center">
                <h3 className="text-xl font-bold mb-4">Entri Elevate - MERN - 2026 - ME5</h3>
                <p className="text-blue-200 mb-2">Practice and Education Purpose "License"</p>
                <p className="text-gray-400 text-sm">Credits: Ashfaaq Feroz Muhammad</p>
                <div className="mt-6 text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} ME5 E-Commerce Platform. All Rights Reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
