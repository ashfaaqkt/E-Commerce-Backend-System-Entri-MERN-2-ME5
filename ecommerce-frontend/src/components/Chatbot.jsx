import { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaTimes, FaPaperPlane, FaRobot, FaUser, FaSpinner } from 'react-icons/fa';
import { RiSparkling2Fill } from 'react-icons/ri';
import axiosInstance from '../api/axiosInstance';

const QUICK_SUGGESTIONS = [
    'What is your return policy?',
    'How long does shipping take?',
    'Track my order',
    'How do I become a Seller?',
    'What payment methods do you accept?',
];

const Chatbot = ({ onOpenChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'model', text: '👋 Hi! I\'m your Basket AI assistant. I can help with orders, products, shipping, returns, and more. How can I help you today?' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const { darkMode } = useSelector((state) => state.theme);
    const { userInfo } = useSelector((state) => state.auth);

    const toggleChat = () => {
        const next = !isOpen;
        setIsOpen(next);
        if (onOpenChange) onOpenChange(next);
    };

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const sendMessage = async (text) => {
        const userText = text || inputValue.trim();
        if (!userText || loading) return;

        const newMessages = [...messages, { role: 'user', text: userText }];
        setMessages(newMessages);
        setInputValue('');
        setLoading(true);

        try {
            // Build history excluding the initial greeting
            const history = newMessages.slice(1, -1).map(m => ({ role: m.role, text: m.text }));
            const res = await axiosInstance.post('/ai/chat', { message: userText, history });
            setMessages(prev => [...prev, { role: 'model', text: res.data.reply }]);
        } catch (err) {
            const errorMsg = err.response?.data?.error || '⚠️ Sorry, I\'m having trouble connecting right now. Please try again in a moment.';
            setMessages(prev => [...prev, {
                role: 'model',
                text: errorMsg
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const formatText = (text) => {
        // Convert **bold** and line breaks
        return text
            .split('\n')
            .map((line, i) => (
                <span key={i}>
                    {line.split(/(\*\*.*?\*\*)/).map((part, j) =>
                        part.startsWith('**') && part.endsWith('**')
                            ? <strong key={j}>{part.slice(2, -2)}</strong>
                            : part
                    )}
                    {i < text.split('\n').length - 1 && <br />}
                </span>
            ));
    };

    return (
        <>
            {/* Chat Toggle Button */}
            <button
                onClick={toggleChat}
                className={`fixed bottom-8 left-8 z-50 w-14 h-14 rounded-2xl shadow-2xl flex items-center justify-center transition-all duration-300 transform hover:scale-110 active:scale-95 ${
                    isOpen
                        ? (darkMode ? 'bg-red-600 hover:bg-red-500' : 'bg-red-500 hover:bg-red-600')
                        : (darkMode ? 'bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500' : 'bg-gradient-to-br from-blue-700 to-purple-700 hover:from-blue-600 hover:to-purple-600')
                } group`}
                title={isOpen ? 'Close Chat' : 'Chat with AI Assistant'}
            >
                {isOpen ? (
                    <FaTimes className="text-white text-xl" />
                ) : (
                    <>
                        <RiSparkling2Fill className="text-white text-2xl" />
                        {/* Pulse ring */}
                        <span className="absolute w-full h-full rounded-2xl animate-ping opacity-30 bg-blue-500"></span>
                    </>
                )}
            </button>

            {/* Chat Window */}
            <div className={`fixed bottom-28 left-4 z-50 w-[350px] sm:w-[380px] transition-all duration-500 ease-in-out ${
                isOpen
                    ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto'
                    : 'opacity-0 translate-y-8 scale-95 pointer-events-none'
            }`}>
                <div className={`rounded-3xl shadow-2xl overflow-hidden border flex flex-col h-[520px] ${
                    darkMode
                        ? 'bg-gray-900 border-gray-700'
                        : 'bg-white border-blue-100'
                }`}>
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-700 to-purple-700 px-5 py-4 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                            <RiSparkling2Fill className="text-white text-xl" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-white font-bold text-sm leading-none">Basket AI</h3>
                            <div className="flex items-center gap-1.5 mt-1">
                                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                                <p className="text-blue-100 text-xs">Online · Powered by Gemini</p>
                            </div>
                        </div>
                        {userInfo && (
                            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                                userInfo.role === 'admin'
                                    ? 'bg-purple-500/30 text-purple-200'
                                    : 'bg-blue-500/30 text-blue-100'
                            }`}>
                                {userInfo.role === 'admin' ? 'Seller' : 'Customer'}
                            </span>
                        )}
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-blue-200">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                {/* Avatar */}
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-sm ${
                                    msg.role === 'model'
                                        ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white'
                                        : (darkMode ? 'bg-gray-700 text-gray-300' : 'bg-blue-100 text-blue-700')
                                }`}>
                                    {msg.role === 'model' ? <RiSparkling2Fill /> : <FaUser />}
                                </div>
                                {/* Bubble */}
                                <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                                    msg.role === 'user'
                                        ? 'bg-gradient-to-br from-blue-700 to-purple-700 text-white rounded-tr-sm'
                                        : (darkMode
                                            ? 'bg-gray-800 text-gray-200 rounded-tl-sm border border-gray-700'
                                            : 'bg-blue-50 text-gray-800 rounded-tl-sm border border-blue-100')
                                }`}>
                                    {formatText(msg.text)}
                                </div>
                            </div>
                        ))}

                        {/* Loading indicator */}
                        {loading && (
                            <div className="flex items-start gap-2.5">
                                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                                    <RiSparkling2Fill className="text-white text-sm" />
                                </div>
                                <div className={`px-4 py-3 rounded-2xl rounded-tl-sm border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-blue-50 border-blue-100'}`}>
                                    <div className="flex gap-1 items-center">
                                        <span className={`w-2 h-2 rounded-full animate-bounce ${darkMode ? 'bg-blue-400' : 'bg-blue-600'}`} style={{ animationDelay: '0ms' }}></span>
                                        <span className={`w-2 h-2 rounded-full animate-bounce ${darkMode ? 'bg-purple-400' : 'bg-purple-600'}`} style={{ animationDelay: '150ms' }}></span>
                                        <span className={`w-2 h-2 rounded-full animate-bounce ${darkMode ? 'bg-blue-400' : 'bg-blue-600'}`} style={{ animationDelay: '300ms' }}></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick Suggestions (only at start) */}
                    {messages.length <= 1 && (
                        <div className="px-4 pb-2">
                            <div className="flex flex-wrap gap-2">
                                {QUICK_SUGGESTIONS.map((s, i) => (
                                    <button
                                        key={i}
                                        onClick={() => sendMessage(s)}
                                        className={`text-xs px-3 py-1.5 rounded-xl border font-medium transition-all hover:scale-105 ${
                                            darkMode
                                                ? 'border-gray-700 text-blue-400 hover:bg-gray-800'
                                                : 'border-blue-200 text-blue-700 hover:bg-blue-50'
                                        }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input */}
                    <div className={`p-4 border-t ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                        <div className={`flex items-center gap-2 rounded-2xl border px-4 py-2.5 transition-all ${
                            darkMode
                                ? 'bg-gray-800 border-gray-700 focus-within:border-blue-500'
                                : 'bg-gray-50 border-gray-200 focus-within:border-blue-400'
                        }`}>
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask me anything..."
                                disabled={loading}
                                className={`flex-1 bg-transparent text-sm outline-none ${
                                    darkMode ? 'text-white placeholder-gray-500' : 'text-gray-800 placeholder-gray-400'
                                }`}
                            />
                            <button
                                onClick={() => sendMessage()}
                                disabled={!inputValue.trim() || loading}
                                className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                                    inputValue.trim() && !loading
                                        ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white hover:scale-110 shadow-md'
                                        : (darkMode ? 'text-gray-600' : 'text-gray-300')
                                }`}
                            >
                                {loading ? <FaSpinner className="animate-spin text-sm" /> : <FaPaperPlane className="text-sm" />}
                            </button>
                        </div>
                        <p className={`text-center text-[10px] mt-2 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                            Powered by Google Gemini AI
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Chatbot;
