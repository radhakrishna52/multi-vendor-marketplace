import React, { useState, useEffect } from 'react';
import apiClient from '../utils/api';
import { useAuthStore } from '../store/authStore';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import ProductCard from '../components/ProductCard';
import { Star, TrendingUp, ShoppingBag, Package, MessageSquare, Quote } from 'lucide-react';

function StarDisplay({ value, size = 'sm' }) {
  const sz = size === 'lg' ? 'w-6 h-6' : 'w-4 h-4';
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(star => (
        <Star key={star} className={`${sz} ${star <= Math.round(value) ? 'fill-[#D4AF37] text-[#D4AF37]' : 'fill-transparent text-[#D4AF37]/25'}`} />
      ))}
    </div>
  );
}

function RatingBar({ stars, count, total }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-8 text-right text-gray-500 font-mono">{stars}★</span>
      <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div className="h-full bg-[#D4AF37] rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-8 text-gray-500 font-mono">{count}</span>
    </div>
  );
}

export default function SellerDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: 0, category: 'Women Fashion', image_url: '', stock: 1 });
  const [addingProduct, setAddingProduct] = useState(false);

  const user = useAuthStore(state => state.user);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('action') === 'add-product') setShowAddForm(true);
  }, [searchParams]);

  const fetchDashboard = async () => {
    try {
      const response = await apiClient.get('/api/vendors/me/dashboard');
      setDashboardData(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user || user.role !== 'seller') { navigate('/'); return; }
    fetchDashboard();
  }, [user, navigate]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setAddingProduct(true);
    try {
      await apiClient.post('/api/vendors/products', newProduct);
      setNewProduct({ name: '', description: '', price: 0, category: 'Women Fashion', image_url: '', stock: 1 });
      setShowAddForm(false);
      fetchDashboard();
    } catch (err) {
      alert(err.response?.data?.detail || 'Error adding product');
    } finally {
      setAddingProduct(false);
    }
  };

  if (loading) return <div className="pt-28"><LoadingSpinner /></div>;
  if (error) return <div className="pt-28 text-center text-red-500">{error}</div>;

  const { avg_rating = 0, total_reviews = 0, recent_reviews = [] } = dashboardData;

  return (
    <div className="pt-24 pb-20 px-4 min-h-screen bg-[#FAFAF8] dark:bg-gray-950 transition-colors">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-end mb-8 border-b border-gray-200 dark:border-gray-800 pb-6">
          <div>
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#D4AF37] mb-1">Merchant Portal</p>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              {dashboardData.business_name}
            </h1>
          </div>
          <button onClick={() => setShowAddForm(!showAddForm)}
            className="bg-[#D4AF37] hover:bg-[#c4a032] text-white font-bold py-3 px-6 text-xs tracking-widest uppercase transition-all">
            {showAddForm ? 'Cancel' : '+ Add Product'}
          </button>
        </div>

        {/* Add Product Form */}
        {showAddForm && (
          <div className="bg-white dark:bg-gray-900 border border-[#D4AF37]/40 p-8 mb-10 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-6">Create New Listing</h3>
            <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input type="text" placeholder="Product Name" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="p-3 border border-gray-200 dark:border-gray-700 text-sm outline-none focus:border-[#D4AF37] bg-transparent dark:text-white" required />
              <input type="number" placeholder="Price (₹)" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})} className="p-3 border border-gray-200 dark:border-gray-700 text-sm outline-none focus:border-[#D4AF37] bg-transparent dark:text-white" required min="1" />
              <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="p-3 border border-gray-200 dark:border-gray-700 text-sm outline-none focus:border-[#D4AF37] bg-white dark:bg-gray-900 dark:text-white" required>
                {['Women Fashion','Men Fashion','Kids Fashion','Beauty & Care','Home & Living','Accessories'].map(c => <option key={c}>{c}</option>)}
              </select>
              <input type="number" placeholder="Initial Stock" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: parseInt(e.target.value)})} className="p-3 border border-gray-200 dark:border-gray-700 text-sm outline-none focus:border-[#D4AF37] bg-transparent dark:text-white" required min="1" />
              <input type="url" placeholder="Image URL" value={newProduct.image_url} onChange={e => setNewProduct({...newProduct, image_url: e.target.value})} className="p-3 border border-gray-200 dark:border-gray-700 text-sm outline-none focus:border-[#D4AF37] bg-transparent dark:text-white md:col-span-2" required />
              <textarea placeholder="Product description..." value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="p-3 border border-gray-200 dark:border-gray-700 text-sm outline-none focus:border-[#D4AF37] bg-transparent dark:text-white md:col-span-2 h-24 resize-none" required />
              <button type="submit" disabled={addingProduct} className="md:col-span-2 bg-[#D4AF37] hover:bg-[#c4a032] text-white font-bold py-3 text-xs tracking-widest uppercase transition disabled:opacity-50">
                {addingProduct ? 'Publishing...' : 'Publish Product'}
              </button>
            </form>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 p-6 text-center shadow-sm">
            <TrendingUp className="w-5 h-5 text-[#D4AF37] mx-auto mb-2" />
            <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-[#D4AF37]">₹{dashboardData.total_revenue.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 p-6 text-center shadow-sm">
            <ShoppingBag className="w-5 h-5 text-gray-400 mx-auto mb-2" />
            <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Orders</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardData.orders_count}</p>
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 p-6 text-center shadow-sm">
            <Package className="w-5 h-5 text-gray-400 mx-auto mb-2" />
            <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Active Listings</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{dashboardData.products_count}</p>
          </div>
          {/* ── Seller Rating Card ── */}
          <div className="bg-white dark:bg-gray-900 border border-[#D4AF37]/40 p-6 text-center shadow-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/5 to-transparent pointer-events-none" />
            <Star className="w-5 h-5 text-[#D4AF37] mx-auto mb-2 fill-[#D4AF37]" />
            <p className="text-[10px] uppercase tracking-widest text-gray-500 mb-1">Avg. Rating</p>
            <p className="text-2xl font-bold text-[#D4AF37]">{avg_rating > 0 ? avg_rating.toFixed(1) : '—'}</p>
            <p className="text-[10px] text-gray-400 mt-1">{total_reviews} review{total_reviews !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {/* ── Ratings Analytics Panel ── */}
        {avg_rating > 0 && (
          <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 shadow-sm mb-10">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <Star className="w-4 h-4 text-[#D4AF37]" /> Customer Ratings Overview
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Big avg score */}
              <div className="flex flex-col items-center justify-center text-center border-r border-gray-100 dark:border-gray-800 pr-8">
                <p className="text-6xl font-black text-[#D4AF37]">{avg_rating.toFixed(1)}</p>
                <StarDisplay value={avg_rating} size="lg" />
                <p className="text-sm text-gray-500 mt-2">Based on {total_reviews} reviews</p>
              </div>
              {/* Breakdown bars — we'll show from recent_reviews data */}
              <div className="space-y-2 flex flex-col justify-center">
                {[5, 4, 3, 2, 1].map(star => {
                  const count = recent_reviews.filter(r => r.rating === star).length;
                  return <RatingBar key={star} stars={star} count={count} total={recent_reviews.length} />;
                })}
                <p className="text-[9px] text-gray-400 pt-1">* Showing distribution from your recent 5 reviews</p>
              </div>
            </div>

            {/* Recent Reviews Feed */}
            {recent_reviews.length > 0 && (
              <div className="border-t border-gray-100 dark:border-gray-800 p-6">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-4 flex items-center gap-2">
                  <MessageSquare className="w-3.5 h-3.5" /> Recent Customer Feedback
                </h3>
                <div className="space-y-4">
                  {recent_reviews.map(r => (
                    <div key={r.id} className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800/40 rounded-sm">
                      <Quote className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <StarDisplay value={r.rating} />
                            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{r.reviewer_name}</span>
                          </div>
                          <span className="text-[10px] text-gray-400">
                            {new Date(r.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mb-1">on <span className="text-[#D4AF37] font-semibold">{r.product_name}</span></p>
                        {r.comment && <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{r.comment}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Products Catalog */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 mb-6">Your Catalog</h2>
          {dashboardData.products.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-12 text-center text-gray-400 text-sm">
              You haven't listed any products yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {dashboardData.products.map(product => (
                <ProductCard key={product.id || product._id} product={product} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
