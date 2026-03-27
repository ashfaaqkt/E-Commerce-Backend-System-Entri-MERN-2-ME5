import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaCamera, FaUser } from 'react-icons/fa';
import axiosInstance from '../api/axiosInstance';
import { updateProfile } from '../redux/slices/authSlice';

const Profile = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const { darkMode } = useSelector((state) => state.theme);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [avatar, setAvatar] = useState('');
    const [address, setAddress] = useState({ street: '', city: '', state: '', country: '', zip: '' });
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!userInfo) { navigate('/login'); return; }
        const fetchProfile = async () => {
            try {
                const res = await axiosInstance.get('/users/profile');
                const u = res.data.data;
                setName(u.name || '');
                setEmail(u.email || '');
                setPhone(u.phone || '');
                setAvatar(u.avatar || '');
                setAddress(u.address || { street: '', city: '', state: '', country: '', zip: '' });
            } catch (e) { console.error(e); }
        };
        fetchProfile();
    }, [userInfo, navigate]);

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setAvatar(reader.result);
        reader.readAsDataURL(file);
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true); setSuccess(''); setError('');
        try {
            const resultAction = await dispatch(updateProfile({ name, phone, avatar, address }));
            if (updateProfile.fulfilled.match(resultAction)) {
                setSuccess('✅ Profile updated successfully!');
            } else {
                setError(resultAction.payload || 'Update failed');
            }
        } catch (err) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className={`rounded-3xl shadow-xl p-8 border transition-colors ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-blue-50'}`}>
                <h1 className={`text-3xl font-extrabold mb-8 ${darkMode ? 'text-white' : 'text-blue-900'}`}>My Profile</h1>

                {success && <div className="mb-5 bg-green-50 p-4 rounded-xl border border-green-200 text-green-700 text-sm font-semibold">{success}</div>}
                {error && <div className="mb-5 bg-red-50 p-4 rounded-xl border border-red-200 text-red-600 text-sm font-semibold">{error}</div>}

                {/* Avatar */}
                <div className="flex flex-col items-center mb-8">
                    <div className="relative">
                        <div className={`w-28 h-28 rounded-full flex items-center justify-center overflow-hidden border-4 shadow-lg ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-blue-100 border-blue-300'}`}>
                            {avatar ? (
                                <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <FaUser className={darkMode ? 'text-gray-500 text-5xl' : 'text-blue-400 text-5xl'} />
                            )}
                        </div>
                        <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition shadow-lg">
                            <FaCamera size={14} />
                            <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                        </label>
                    </div>
                    <p className={`mt-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Click the camera icon to change your photo</p>
                </div>

                <form onSubmit={submitHandler} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className={`text-sm font-bold mb-1 block ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Full Name</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800'}`} />
                        </div>
                        <div>
                            <label className={`text-sm font-bold mb-1 block ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email Address</label>
                            <input type="email" value={email} disabled
                                className={`w-full px-4 py-3 rounded-xl border cursor-not-allowed ${darkMode ? 'bg-gray-900 border-gray-700 text-gray-500' : 'bg-gray-50 border-gray-200 text-gray-400'}`} />
                        </div>
                        <div>
                            <label className={`text-sm font-bold mb-1 block ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Phone Number</label>
                            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 XXXXX XXXXX"
                                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800'}`} />
                        </div>
                        <div>
                            <label className={`text-sm font-bold mb-1 block ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Street</label>
                            <input type="text" value={address.street} onChange={(e) => setAddress({...address, street: e.target.value})} placeholder="Street / Apartment"
                                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800'}`} />
                        </div>
                        <div>
                            <label className={`text-sm font-bold mb-1 block ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>City</label>
                            <input type="text" value={address.city} onChange={(e) => setAddress({...address, city: e.target.value})} placeholder="City"
                                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800'}`} />
                        </div>
                        <div>
                            <label className={`text-sm font-bold mb-1 block ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>State</label>
                            <input type="text" value={address.state} onChange={(e) => setAddress({...address, state: e.target.value})} placeholder="State"
                                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800'}`} />
                        </div>
                        <div>
                            <label className={`text-sm font-bold mb-1 block ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Country</label>
                            <input type="text" value={address.country} onChange={(e) => setAddress({...address, country: e.target.value})} placeholder="Country"
                                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800'}`} />
                        </div>
                        <div>
                            <label className={`text-sm font-bold mb-1 block ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>PIN Code</label>
                            <input type="text" value={address.zip} onChange={(e) => setAddress({...address, zip: e.target.value})} placeholder="ZIP / PIN Code"
                                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800'}`} />
                        </div>
                    </div>
                    <button type="submit" disabled={loading}
                        className={`w-full py-3 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-2 transition-all ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 shadow-lg hover:shadow-xl'}`}>
                        {loading ? (<><svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Saving...</>) : 'Save Profile'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
