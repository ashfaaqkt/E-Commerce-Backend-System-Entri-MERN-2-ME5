import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaTruck, FaMapMarkerAlt, FaGlobe, FaCity, FaMailBulk, FaPhone } from 'react-icons/fa';
import { updateProfile } from '../redux/slices/authSlice';

const Shipping = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state) => state.auth);
    const { darkMode } = useSelector((state) => state.theme);
    
    // Pre-fill from profile first, then local storage
    const [address, setAddress] = useState(userInfo?.address?.street || '');
    const [city, setCity] = useState(userInfo?.address?.city || '');
    const [postalCode, setPostalCode] = useState(userInfo?.address?.zip || '');
    const [country, setCountry] = useState(userInfo?.address?.country || 'India');
    const [phone, setPhone] = useState(userInfo?.phone || '');
    const [profileError, setProfileError] = useState('');

    const handleUseProfileAddress = () => {
        if (userInfo?.address?.street && userInfo?.address?.city) {
            setAddress(userInfo.address.street);
            setCity(userInfo.address.city);
            setPostalCode(userInfo.address.zip);
            setCountry(userInfo.address.country);
            setPhone(userInfo.phone || phone);
            setProfileError('');
        } else {
            setProfileError('❌ Profile address not filled, please fill the empty boxes manually.');
            setTimeout(() => setProfileError(''), 4000);
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        
        // Save to local storage for PlaceOrder
        localStorage.setItem('shippingAddress', JSON.stringify({ address, city, postalCode, country, phone }));
        
        // Save to profile in backend
        await dispatch(updateProfile({
            phone: phone,
            address: {
                street: address,
                city: city,
                zip: postalCode,
                country: country
            }
        }));
        
        navigate('/placeorder');
    };

    return (
        <div className="max-w-md mx-auto py-12 px-4">
            <div className={`rounded-3xl shadow-2xl p-8 border transition-colors ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-blue-50'}`}>
                <div className="text-center mb-8">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${darkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                        <FaTruck size={28} />
                    </div>
                    <h1 className={`text-3xl font-extrabold mb-2 ${darkMode ? 'text-white' : 'text-blue-900'}`}>Shipping Details</h1>
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Where should we send your order?</p>
                </div>

                <div className="mb-6">
                    <button
                        onClick={handleUseProfileAddress}
                        className={`w-full py-2.5 px-4 rounded-xl font-bold border transition flex items-center justify-center gap-2 mb-2 ${
                            darkMode 
                                ? 'bg-blue-900/20 text-blue-400 border-blue-900/30 hover:bg-blue-900/40' 
                                : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                        }`}
                    >
                        🏠 Use same address as Profile
                    </button>
                    {profileError && (
                        <p className="text-xs text-red-500 font-bold text-center animate-pulse">{profileError}</p>
                    )}
                </div>

                <form onSubmit={submitHandler} className="space-y-5">
                    <div>
                        <label className={`block text-sm font-bold mb-2 flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            <FaPhone className={darkMode ? 'text-blue-400' : 'text-blue-500'} /> Phone Number
                        </label>
                        <input
                            type="tel"
                            placeholder="Enter your phone number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800'}`}
                        />
                    </div>
                    <div>
                        <label className={`block text-sm font-bold mb-2 flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            <FaMapMarkerAlt className={darkMode ? 'text-blue-400' : 'text-blue-500'} /> Address / Street
                        </label>
                        <input
                            type="text"
                            placeholder="Enter address"
                            value={address}
                            required
                            onChange={(e) => setAddress(e.target.value)}
                            className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800'}`}
                        />
                    </div>

                    <div>
                        <label className={`block text-sm font-bold mb-2 flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            <FaCity className={darkMode ? 'text-blue-400' : 'text-blue-500'} /> City
                        </label>
                        <input
                            type="text"
                            placeholder="Enter city"
                            value={city}
                            required
                            onChange={(e) => setCity(e.target.value)}
                            className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800'}`}
                        />
                    </div>

                    <div>
                        <label className={`block text-sm font-bold mb-2 flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            <FaMailBulk className={darkMode ? 'text-blue-400' : 'text-blue-500'} /> Postal Code
                        </label>
                        <input
                            type="text"
                            placeholder="Enter postal code"
                            value={postalCode}
                            required
                            onChange={(e) => setPostalCode(e.target.value)}
                            className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800'}`}
                        />
                    </div>

                    <div>
                        <label className={`block text-sm font-bold mb-2 flex items-center gap-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            <FaGlobe className={darkMode ? 'text-blue-400' : 'text-blue-500'} /> Country
                        </label>
                        <input
                            type="text"
                            placeholder="Enter country"
                            value={country}
                            required
                            onChange={(e) => setCountry(e.target.value)}
                            className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800'}`}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg mt-4"
                    >
                        Continue to Checkout
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Shipping;
