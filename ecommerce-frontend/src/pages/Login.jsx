import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { GoogleLogin } from '@react-oauth/google';
import { login } from '../redux/slices/authSlice';
import axiosInstance from '../api/axiosInstance';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [googleError, setGoogleError] = useState(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { userInfo, loading, error } = useSelector((state) => state.auth);
    const { darkMode } = useSelector((state) => state.theme);

    const redirect = location.search ? location.search.split('=')[1] : '/';

    useEffect(() => {
        if (userInfo) navigate(redirect);
    }, [navigate, userInfo, redirect]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(login({ email, password }));
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setGoogleError(null);
        try {
            const response = await axiosInstance.post('/auth/google', {
                credential: credentialResponse.credential,
            });
            const data = response.data;
            localStorage.setItem('userInfo', JSON.stringify(data));
            // Dispatch a manual login success
            dispatch({ type: 'auth/login/fulfilled', payload: data });
        } catch (err) {
            const serverError = err.response?.data?.error;
            if (serverError === 'ROLE_REQUIRED') {
                setGoogleError('New account — please use the Register page to select your account type first.');
            } else {
                setGoogleError(err.response?.data?.message || 'Google sign-in failed. Please try again.');
            }
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[70vh]">
            <div className={`w-full max-w-md p-10 rounded-3xl shadow-2xl border transform transition-all hover:scale-[1.01] ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-blue-50'}`}>
                <div className="text-center mb-8">
                    <h2 className={`text-4xl font-extrabold mb-2 ${darkMode ? 'text-white' : 'text-blue-900'}`}>Welcome Back</h2>
                    <p className={`${darkMode ? 'text-blue-400' : 'text-blue-500'} font-medium`}>Sign in to access your account</p>
                </div>

                {(error || googleError) && (
                    <div className={`mb-6 p-4 rounded-xl border text-center text-sm font-semibold ${darkMode ? 'bg-red-900/20 border-red-900/30 text-red-400' : 'bg-red-50 border-red-200 text-red-600'}`}>
                        {error || googleError}
                    </div>
                )}

                {/* Google Login */}
                <div className="mb-6">
                    <div className="flex justify-center">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => setGoogleError('Google sign-in failed. Please try again.')}
                            theme={darkMode ? 'filled_black' : 'outline'}
                            size="large"
                            width="100%"
                            text="signin_with"
                            shape="rectangular"
                        />
                    </div>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 mb-6">
                    <div className={`flex-1 h-px ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}></div>
                    <span className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-400'}`}>or continue with email</span>
                    <div className={`flex-1 h-px ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}></div>
                </div>

                <form onSubmit={submitHandler} className="space-y-6">
                    <div>
                        <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800'}`}
                        />
                    </div>
                    <div className="relative">
                        <label className={`block text-sm font-bold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Password</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-800'}`}
                        />
                        <button
                            type="button"
                            className="absolute right-4 top-10 text-gray-500 hover:text-blue-600 focus:outline-none"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 px-4 rounded-xl text-white font-bold text-lg shadow-lg transition-all flex items-center justify-center ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-700 to-blue-500 hover:from-blue-800 hover:to-blue-600 hover:shadow-xl'}`}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Signing In...
                            </>
                        ) : 'Sign In'}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        New here?{' '}
                        <Link to="/register" className={`font-bold hover:underline transition-colors ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}>
                            Create an Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
