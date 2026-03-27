import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaTruck, FaMapMarkerAlt, FaGlobe, FaCity, FaMailBulk, FaPhone } from 'react-icons/fa';
import { updateProfile } from '../redux/slices/authSlice';

const Shipping = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state) => state.auth);
    
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
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-blue-50">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                        <FaTruck size={28} />
                    </div>
                    <h1 className="text-3xl font-extrabold text-blue-900 mb-2">Shipping Details</h1>
                    <p className="text-gray-500">Where should we send your order?</p>
                </div>

                <div className="mb-6">
                    <button
                        onClick={handleUseProfileAddress}
                        className="w-full py-2.5 px-4 bg-blue-50 text-blue-700 rounded-xl font-bold border border-blue-200 hover:bg-blue-100 transition flex items-center justify-center gap-2 mb-2"
                    >
                        🏠 Use same address as Profile
                    </button>
                    {profileError && (
                        <p className="text-xs text-red-500 font-bold text-center animate-pulse">{profileError}</p>
                    )}
                </div>

                <form onSubmit={submitHandler} className="space-y-5">
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center gap-2">
                            <FaPhone className="text-blue-500" /> Phone Number
                        </label>
                        <input
                            type="tel"
                            placeholder="Enter your phone number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center gap-2">
                            <FaMapMarkerAlt className="text-blue-500" /> Address / Street
                        </label>
                        <input
                            type="text"
                            placeholder="Enter address"
                            value={address}
                            required
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center gap-2">
                            <FaCity className="text-blue-500" /> City
                        </label>
                        <input
                            type="text"
                            placeholder="Enter city"
                            value={city}
                            required
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center gap-2">
                            <FaMailBulk className="text-blue-500" /> Postal Code
                        </label>
                        <input
                            type="text"
                            placeholder="Enter postal code"
                            value={postalCode}
                            required
                            onChange={(e) => setPostalCode(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center gap-2">
                            <FaGlobe className="text-blue-500" /> Country
                        </label>
                        <input
                            type="text"
                            placeholder="Enter country"
                            value={country}
                            required
                            onChange={(e) => setCountry(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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
