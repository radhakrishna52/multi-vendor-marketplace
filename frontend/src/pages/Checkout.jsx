import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import apiClient from '../utils/api';
import { motion } from 'framer-motion';

export default function Checkout() {
  const { items, total, clearCart } = useCartStore();
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const navigate = useNavigate();
  
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Redirect if not logged in
  if (!isAuthenticated) {
    return (
      <div className="pt-28 min-h-[70vh] flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-display mb-4">Account Required</h2>
        <p className="text-text-secondary mb-6">Please log in to complete your purchase.</p>
        <button onClick={() => navigate('/login')} className="btn-gold">Sign In</button>
      </div>
    );
  }

  const handleCheckout = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const orderData = {
        items: items.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        })),
        shipping_address: address || "123 DreamCart Avenue, CA 90210"
      };

      await apiClient.post('/api/orders', orderData);
      
      setSuccess(true);
      clearCart();
      
      setTimeout(() => {
        navigate('/');
      }, 3000);
      
    } catch (err) {
      setError(err.response?.data?.detail || 'Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="pt-28 min-h-[70vh] flex flex-col items-center justify-center text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-20 h-20 bg-gold/20 text-gold rounded-full flex items-center justify-center text-3xl mb-6">✓</motion.div>
        <h2 className="text-3xl font-display mb-2 text-charcoal">Order Confirmed</h2>
        <p className="text-text-secondary mb-8">Your luxury items are being prepared for dispatch.</p>
        <p className="text-xs uppercase tracking-widest animate-pulse">Redirecting to home...</p>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 px-4 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-display mb-8">Checkout</h1>
        
        {error && <div className="mb-6 p-4 bg-rose-gold/10 text-rose-gold text-sm rounded-sm border border-rose-gold/20">{error}</div>}

        <div className="bg-white border border-border p-8 rounded-sm">
          <form onSubmit={handleCheckout} className="space-y-6">
            <div>
              <h2 className="font-heading font-bold mb-4 uppercase tracking-widest text-sm">Shipping Details</h2>
              <label className="label-luxe">Delivery Address</label>
              <textarea 
                rows="3" 
                className="input-luxe" 
                placeholder="123 DreamCart Avenue, CA 90210"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
            
            <div className="pt-6 border-t border-border">
              <h2 className="font-heading font-bold mb-4 uppercase tracking-widest text-sm">Payment Details</h2>
              <div className="p-4 bg-cream/50 border border-border rounded-sm flex items-center gap-3">
                <span className="text-xl">💳</span>
                <p className="text-sm text-text-secondary">Using secure mock payment gateway for this session. No real card required.</p>
              </div>
            </div>
            
            <div className="pt-6 border-t border-border">
               <div className="flex justify-between font-bold text-xl mb-6">
                <span>Total to Pay</span>
                <span className="text-gold">₹{total.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
              </div>
              
              <button type="submit" className="w-full btn-gold justify-center py-3" disabled={loading || items.length === 0}>
                {loading ? 'PROCESSING...' : 'CONFIRM ORDER'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
