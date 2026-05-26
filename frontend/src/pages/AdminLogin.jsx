import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import apiClient from '../utils/api';
import { useAuthStore } from '../store/authStore';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
      setPassword('Password123!');
    }
  }, [searchParams]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiClient.post('/api/auth/login', { email, password });
      const userData = response.data.user;
      
      // Strict role check for Admin portal
      if (userData.role !== 'admin') {
        setError('ACCESS DENIED: Insufficient clearance level.');
        setLoading(false);
        return;
      }

      login(userData, response.data.access_token);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.detail || 'Authentication sequence failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-20 px-4 bg-black">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="p-10 w-full max-w-md bg-[#0A0A0A] border border-gray-800 shadow-2xl relative overflow-hidden"
      >
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        
        <div className="text-center mb-10 relative z-10">
          <div className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
            <span className="font-bold text-2xl">⚡</span>
          </div>
          <h2 className="text-2xl font-bold tracking-[0.2em] uppercase text-white" style={{ fontFamily: 'Inter, sans-serif' }}>System Access</h2>
          <p className="text-xs mt-3 text-red-500 font-mono tracking-widest uppercase">Restricted Admin Area</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-950/30 text-red-500 border border-red-900 text-xs font-mono tracking-wide text-center uppercase"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
          <div>
            <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 mb-2">Admin Identification</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-4 bg-black border border-gray-800 text-white focus:outline-none focus:border-white transition-colors placeholder-gray-700 font-mono text-sm"
              placeholder="admin@domain.com"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 mb-2">Security Key</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-4 bg-black border border-gray-800 text-white focus:outline-none focus:border-white transition-colors placeholder-gray-700 font-mono text-sm tracking-widest"
              placeholder="••••••••"
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-white text-black hover:bg-gray-200 transition-all duration-300 py-5 text-xs font-bold tracking-[0.2em] uppercase mt-4" 
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Initialize Override'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
