import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';

// Placeholder Pages - ideally these would be full components
const ProductDetail = () => <div className="p-8 text-center text-2xl font-bold min-h-screen">Product Detail Page</div>;
const Cart = () => <div className="p-8 text-center text-2xl font-bold min-h-screen">Cart Page</div>;
const Orders = () => <div className="p-8 text-center text-2xl font-bold min-h-screen">Orders Page</div>;
const Contact = () => <div className="p-8 text-center text-2xl font-bold min-h-screen">Contact Page</div>;

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-900 to-white text-gray-800 font-sans">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
