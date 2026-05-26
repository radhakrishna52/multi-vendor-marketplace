import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../utils/api';
import { useAuthStore } from '../store/authStore';
import { ShoppingBag, Briefcase, Sparkles } from 'lucide-react';

export default function Signup() {
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    password: '',
    role: 'buyer' // 'buyer' or 'seller'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Ensure we send 'seller' backend role if vendor is chosen
    const submissionData = {
      ...formData,
      role: formData.role === 'seller' ? 'seller' : 'buyer'
    };

    try {
      const response = await apiClient.post('/api/auth/register', submissionData);
      login(response.data.user, response.data.access_token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-24 pb-12 px-4 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-2xl p-8 rounded-[2rem] my-8 relative overflow-hidden"
      >
        {/* Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-black dark:bg-white text-white dark:text-black rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-bold font-display text-gray-900 dark:text-white">Create Account</h2>
          <p className="text-xs mt-2 text-gray-400 dark:text-gray-500 uppercase tracking-widest font-semibold">Join the luxury marketplace network</p>
        </div>

        {/* Dynamic Category Switcher at the Top */}
        <div className="mb-8 bg-gray-50 dark:bg-gray-850 p-1.5 rounded-2xl border border-gray-150 dark:border-gray-800 flex gap-2">
          <button 
            type="button"
            onClick={() => setFormData({ ...formData, role: 'buyer' })}
            className={`flex-1 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2.5 ${
              formData.role === 'buyer' 
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-md' 
                : 'text-gray-500 hover:text-black dark:hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Shopper Account
          </button>
          
          <button 
            type="button"
            onClick={() => setFormData({ ...formData, role: 'seller' })}
            className={`flex-1 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2.5 ${
              formData.role === 'seller' 
                ? 'bg-black text-white dark:bg-white dark:text-black shadow-md' 
                : 'text-gray-500 hover:text-black dark:hover:text-white'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Vendor Account
          </button>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/35 rounded-xl text-xs font-mono text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="block text-[10px] font-bold tracking-widest uppercase text-gray-500 dark:text-gray-400 mb-2">Full Name</label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full px-4 py-3 bg-transparent border border-gray-200 dark:border-gray-800 text-black dark:text-white text-sm focus:outline-none focus:border-black dark:focus:border-white transition-colors"
              placeholder="e.g. Arjun Mehta"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold tracking-widest uppercase text-gray-500 dark:text-gray-400 mb-2">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-transparent border border-gray-200 dark:border-gray-800 text-black dark:text-white text-sm focus:outline-none focus:border-black dark:focus:border-white transition-colors"
              placeholder="e.g. arjun@dreamcart.com"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold tracking-widest uppercase text-gray-500 dark:text-gray-400 mb-2">Secure Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 bg-transparent border border-gray-200 dark:border-gray-800 text-black dark:text-white text-sm focus:outline-none focus:border-black dark:focus:border-white transition-colors"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-4 bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-opacity text-xs font-bold tracking-widest uppercase mt-4" 
            disabled={loading}
          >
            {loading ? 'REGISTERING...' : `CREATE ${formData.role === 'buyer' ? 'SHOPPER' : 'VENDOR'} ACCOUNT`}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-gray-400">
          Already have a luxury profile?{' '}
          <Link to="/login" className="text-black dark:text-white hover:underline font-bold transition-colors">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
