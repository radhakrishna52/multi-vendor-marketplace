import React, { useState, useEffect } from 'react';
import apiClient from '../utils/api';
import { useAuthStore } from '../store/authStore';
import { useNavigate, Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { Package, Heart, Sparkles, ShoppingBag, ChevronRight, Clock } from 'lucide-react';

export default function CustomerDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore(state => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await apiClient.get('/api/orders');
        setOrders(response.data.orders);
      } catch (err) {
        console.error('Failed to load orders', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [user, navigate]);

  if (loading) return <div className="pt-32 min-h-screen bg-[#FAFAF8] dark:bg-gray-950"><LoadingSpinner /></div>;

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-gray-950 pb-20 transition-colors duration-300">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-12 pt-32">
        
        {/* Luxury Onboarding Banner */}
        <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800/80 rounded-sm p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10 transition-all duration-300">
          <div>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-[0.2em] uppercase text-[#D4AF37] mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Client Privileges
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white font-serif mb-2">
              Welcome back, {user?.full_name || user?.name || 'Venered Client'}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Explore your personal order ledger, track shipments, and curate your private collection.
            </p>
          </div>
          <div className="w-14 h-14 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 dark:bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center shadow-inner shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Order History */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xs font-black tracking-[0.2em] uppercase text-gray-500 dark:text-gray-400 flex items-center gap-2 mb-4">
              <Package className="w-4 h-4 text-[#D4AF37]" /> Order History
            </h2>
            
            {orders.length === 0 ? (
              <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 p-16 text-center rounded-sm flex flex-col items-center shadow-sm">
                <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-6">
                  <ShoppingBag className="w-6 h-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>No active orders</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mb-8 leading-relaxed">
                  Your luxury shopping bag is currently waiting to be filled with curated lifestyle couture.
                </p>
                <Link to="/products" className="inline-block bg-[#D4AF37] hover:bg-[#c4a032] text-white font-bold py-3.5 px-8 text-[11px] tracking-widest uppercase transition-all shadow-sm">
                  Explore Collections
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order._id} className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 p-6 flex flex-col md:flex-row justify-between items-start md:items-center rounded-sm shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-gray-700 transition-all gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold font-mono tracking-widest text-[#D4AF37] uppercase">Order #{order._id.substring(order._id.length - 8).toUpperCase()}</p>
                      <p className="font-bold text-2xl text-gray-900 dark:text-white font-serif">₹{order.total_amount.toLocaleString('en-IN')}</p>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 mt-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Placed on {new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                      <span className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-full ${
                        order.status === 'delivered' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border border-emerald-200 dark:border-emerald-900/30' :
                        order.status === 'shipped' ? 'bg-sky-50 dark:bg-sky-950/20 text-sky-600 border border-sky-200 dark:border-sky-900/30' :
                        'bg-amber-50 dark:bg-amber-950/20 text-amber-600 border border-amber-200 dark:border-amber-900/30'
                      }`}>
                        {order.status}
                      </span>
                      <ChevronRight className="w-5 h-5 text-gray-300 dark:text-gray-700 hidden md:block" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Sidebar / Wishlist Placeholder */}
          <div className="space-y-6">
            <h2 className="text-xs font-black tracking-[0.2em] uppercase text-gray-500 dark:text-gray-400 flex items-center gap-2 mb-4">
              <Heart className="w-4 h-4 text-[#D4AF37]" /> My Wishlist
            </h2>
            <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-850 p-8 text-center rounded-sm shadow-sm flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center mb-6">
                <Heart className="w-5 h-5 text-[#D4AF37]" />
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-2">Curate Favorites</h3>
              <p className="text-gray-500 dark:text-gray-400 text-xs mb-8 leading-relaxed">
                Save items you admire from our verified vendor catalogs to keep them close for immediate checkouts.
              </p>
              <Link to="/products" className="w-full inline-block border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-white text-[10px] font-bold tracking-widest uppercase py-3.5 px-6 transition-all duration-300">
                Explore Couture
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
