import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Storefront from './pages/Storefront';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminLogin from './pages/AdminLogin';

import Products from './pages/Products';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import SellerDashboard from './pages/SellerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import Wishlist from './pages/Wishlist';
import FloatingProfileSwitcher from './components/FloatingProfileSwitcher';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';

// Dynamic Launch Route based on Auth State
const LaunchRoute = () => {
  const { isAuthenticated, user } = useAuthStore();
  
  if (!isAuthenticated) return <Landing />;
  
  if (user?.role === 'admin') return <Navigate to="/admin" replace />;
  if (user?.role === 'seller') return <Navigate to="/seller" replace />;
  
  return <Storefront />;
};

function App() {
  const { isDarkMode } = useThemeStore();
  
  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);
  
  return (
    <Router>
      <div className={`min-h-screen font-sans flex flex-col transition-colors duration-300 ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-[#FAFAF8] text-[#1A1A1A]'}`}>
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LaunchRoute />} />
            <Route path="/products" element={<Products />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/seller" element={<SellerDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/profile" element={<CustomerDashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            {/* Catch-all route to redirect back home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <FloatingProfileSwitcher />
      </div>
    </Router>
  );
}

export default App;
