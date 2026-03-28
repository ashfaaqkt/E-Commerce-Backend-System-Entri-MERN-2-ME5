import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { register } from '../redux/slices/authSlice';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userInfo, loading, error } = useSelector((state) => state.auth);
    const { darkMode } = useSelector((state) => state.theme);

    useEffect(() => {
        if (userInfo) navigate('/');
    }, [navigate, userInfo]);

    const submitHandler = (e) => {
        e.preventDefault();
        if (!role) { setMessage('Please select a role (Seller or Customer)'); return; }
        if (password !== confirmPassword) { setMessage('Passwords do not match'); return; }
        setMessage(null);
        dispatch(register({ name, email, password, role }));
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh] py-8">
            <div className={`w-full max-w-md p-10 rounded-3xl shadow-2xl border transition-colors ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-blue-50'}`}>
                <div className="text-center mb-8">
                    <h2 className={`text-4xl font-extrabold mb-2 ${darkMode ? 'text-white' : 'text-blue-900'}`}>Create Account</h2>
                    <p className={`${darkMode ? 'text-blue-400' : 'text-blue-500'} font-medium`}>Join our premium e-commerce platform</p>
                </div>

                {(error || message) && (
                    <div className={`mb-5 p-4 rounded-xl border text-center text-sm font-semibold ${darkMode ? 'bg-red-900/20 border-red-900/30 text-red-400' : 'bg-red-50 border-red-200 text-red-600'}`}>
                        {error || message}
                    </div>
                )}

                <form onSubmit={submitHandler} className="space-y-4">
                    {/* Role Selector */}
                    <div>
                        <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Account Type <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setRole('admin')}
                                className={`py-3 px-4 rounded-xl border-2 font-semibold transition-all text-center ${role === 'admin'
                                        ? (darkMode ? 'border-blue-500 bg-blue-900/30 text-blue-400' : 'border-blue-600 bg-blue-50 text-blue-700')
                                        : (darkMode ? 'border-gray-700 text-gray-500 hover:border-gray-600' : 'border-gray-200 text-gray-500 hover:border-blue-300')
                                    }`}
                            >
                                🏪 Seller
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole('user')}
                                className={`py-3 px-4 rounded-xl border-2 font-semibold transition-all text-center ${role === 'user'
                                        ? (darkMode ? 'border-blue-500 bg-blue-900/30 text-blue-400' : 'border-blue-600 bg-blue-50 text-blue-700')
                                        : (darkMode ? 'border-gray-700 text-gray-500 hover:border-gray-600' : 'border-gray-200 text-gray-500 hover:border-blue-300')
                                    }`}
                            >
                                🛒 Customer
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Full Name</label>
                        <input type="text" placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} required
                            className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800'}`} />
                    </div>

                    <div>
                        <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email Address</label>
                        <input type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required
                            className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800'}`} />
                    </div>

                    <div className="relative">
                        <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
                        <input type={showPassword ? 'text' : 'password'} placeholder="Min. 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} required
                            className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800'}`} />
                        <button type="button" className="absolute right-4 top-10 text-gray-400 hover:text-blue-600" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                        </button>
                    </div>

                    <div>
                        <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Confirm Password</label>
                        <input type={showPassword ? 'text' : 'password'} placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
                            className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800'}`} />
                    </div>

                    <button type="submit" disabled={loading}
                        className={`w-full py-3 px-4 rounded-xl text-white font-bold text-lg shadow-lg transition-all mt-2 flex items-center justify-center ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 hover:shadow-xl'}`}
                    >
                        {loading ? (
                            <><svg className="animate-spin mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>Creating Account...</>
                        ) : 'Sign Up'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Have an account?{' '}
                        <Link to="/login" className={`font-bold hover:underline transition-colors ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}>Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
