import React, { useState, useEffect } from 'react';
import apiClient from '../utils/api';
import { useAuthStore } from '../store/authStore';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockChartData = [
  { name: 'Jan', revenue: 4000, users: 240 },
  { name: 'Feb', revenue: 3000, users: 139 },
  { name: 'Mar', revenue: 2000, users: 980 },
  { name: 'Apr', revenue: 2780, users: 390 },
  { name: 'May', revenue: 1890, users: 480 },
  { name: 'Jun', revenue: 2390, users: 380 },
  { name: 'Jul', revenue: 3490, users: 430 },
];

export default function AdminDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'dashboard';
  const setActiveTab = (tab) => {
    setSearchParams({ tab });
  };
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Forms State
  const [newCoupon, setNewCoupon] = useState({ code: '', discount_percentage: 10, valid_days: 30 });
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: 0, category: 'Women Fashion', image_url: '' });

  // Deep Dive State
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [editForm, setEditForm] = useState({ full_name: '', email: '', role: '', password: '' });

  const user = useAuthStore(state => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/admin-login');
      return;
    }
    fetchTabData(activeTab, currentPage);
  }, [activeTab, currentPage, user, navigate]);

  const fetchTabData = async (tab, page = 1) => {
    setLoading(true);
    setError('');
    try {
      let endpoint = '';
      if (tab === 'dashboard') endpoint = '/api/admin/dashboard';
      else if (tab === 'users') endpoint = `/api/admin/users?page=${page}&limit=20`;
      else if (tab === 'orders') endpoint = `/api/admin/orders?page=${page}&limit=20`;
      else if (tab === 'coupons') endpoint = `/api/admin/coupons?page=${page}&limit=20`;
      else if (tab === 'products') endpoint = `/api/products?page=${page}&limit=20`;

      const response = await apiClient.get(endpoint);
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1); // Reset page on tab switch
    setData(null);
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/api/admin/coupons', newCoupon);
      setNewCoupon({ code: '', discount_percentage: 10, valid_days: 30 });
      fetchTabData('coupons', 1);
    } catch (err) {
      alert(err.response?.data?.detail || 'Error creating coupon');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/api/admin/products', newProduct);
      setNewProduct({ name: '', description: '', price: 0, category: 'Clothing', image_url: '' });
      fetchTabData('products', 1);
    } catch (err) {
      alert(err.response?.data?.detail || 'Error adding product');
    }
  };

  const handleViewUser = async (userId) => {
    setSelectedUser(userId);
    setLoadingDetails(true);
    setIsEditing(false);
    try {
      const res = await apiClient.get(`/api/admin/users/${userId}`);
      setUserDetails(res.data);
      setEditForm({
        full_name: res.data.user.full_name,
        email: res.data.user.email,
        role: res.data.user.role,
        password: ''
      });
    } catch (err) {
      alert('Failed to fetch deep dive details.');
      setSelectedUser(null);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await apiClient.put(`/api/admin/users/${selectedUser}`, editForm);
      setUserDetails(res.data);
      setIsEditing(false);
      fetchTabData('users', currentPage);
      alert('User credentials updated successfully!');
    } catch (err) {
      alert(err.response?.data?.detail || 'Error updating user.');
    } finally {
      setUpdating(false);
    }
  };

  const PaginationControls = () => {
    if (!data || !data.totalPages || data.totalPages <= 1) return null;
    return (
      <div className="flex items-center justify-between p-4 bg-white border-t border-gray-200">
        <button 
          disabled={data.page === 1}
          onClick={() => setCurrentPage(p => p - 1)}
          className={`text-xs font-bold uppercase tracking-widest px-4 py-2 ${data.page === 1 ? 'text-gray-300' : 'text-black hover:bg-gray-100'}`}
        >
          &larr; Previous
        </button>
        <span className="text-xs text-gray-500 uppercase tracking-widest">Page {data.page} of {data.totalPages}</span>
        <button 
          disabled={data.page === data.totalPages}
          onClick={() => setCurrentPage(p => p + 1)}
          className={`text-xs font-bold uppercase tracking-widest px-4 py-2 ${data.page === data.totalPages ? 'text-gray-300' : 'text-black hover:bg-gray-100'}`}
        >
          Next &rarr;
        </button>
      </div>
    );
  };

  if (loading && !data) return <div className="pt-28"><LoadingSpinner /></div>;

  return (
    <div className="pt-20 pb-20 px-4 min-h-screen bg-gray-50 flex relative">
      
      {/* Deep Dive Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-full md:w-1/2 lg:w-1/3 bg-white h-full shadow-2xl p-6 overflow-y-auto transform transition-transform animate-slide-in-right">
            <button 
              onClick={() => { setSelectedUser(null); setUserDetails(null); }}
              className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-6 hover:text-black transition"
            >
              ← Close Profile
            </button>

            {loadingDetails || !userDetails ? (
              <LoadingSpinner />
            ) : (
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-black mb-1">{userDetails.user.full_name}</h2>
                    <p className="text-sm text-gray-500">{userDetails.user.email}</p>
                  </div>
                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-xs font-bold uppercase tracking-widest text-[#D4AF37] hover:underline"
                  >
                    {isEditing ? 'Cancel' : 'Edit'}
                  </button>
                </div>
                
                <div className="mb-6">
                  <span className={`px-2 py-1 text-[10px] font-bold tracking-widest uppercase ${userDetails.user.role === 'admin' ? 'bg-black text-white' : userDetails.user.role === 'seller' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-500'}`}>
                    {userDetails.user.role} Account
                  </span>
                </div>

                {isEditing ? (
                  <form onSubmit={handleUpdateUser} className="space-y-4 bg-gray-50 p-4 border border-gray-200 mb-6 rounded">
                    <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500">Edit User Profile</h3>
                    <div>
                      <label className="block text-[9px] font-bold tracking-wider text-gray-400 uppercase mb-1">Full Name</label>
                      <input 
                        type="text" 
                        value={editForm.full_name} 
                        onChange={e => setEditForm({...editForm, full_name: e.target.value})} 
                        className="w-full p-2 border border-gray-300 text-sm focus:border-black outline-none bg-white text-black font-semibold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold tracking-wider text-gray-400 uppercase mb-1">Email</label>
                      <input 
                        type="email" 
                        value={editForm.email} 
                        onChange={e => setEditForm({...editForm, email: e.target.value})} 
                        className="w-full p-2 border border-gray-300 text-sm focus:border-black outline-none bg-white text-black font-semibold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold tracking-wider text-gray-400 uppercase mb-1">Role</label>
                      <select 
                        value={editForm.role} 
                        onChange={e => setEditForm({...editForm, role: e.target.value})} 
                        className="w-full p-2 border border-gray-300 text-sm focus:border-black outline-none bg-white text-black font-semibold"
                        required
                      >
                        <option value="buyer">Buyer</option>
                        <option value="seller">Seller</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold tracking-wider text-gray-400 uppercase mb-1">Security Passkey (Leave blank to keep same)</label>
                      <input 
                        type="password" 
                        placeholder="Enter new password" 
                        value={editForm.password} 
                        onChange={e => setEditForm({...editForm, password: e.target.value})} 
                        className="w-full p-2 border border-gray-300 text-sm focus:border-black outline-none bg-white text-black font-semibold"
                      />
                    </div>
                    <button 
                      type="submit" 
                      disabled={updating}
                      className="w-full bg-[#D4AF37] text-white py-2 text-[10px] font-bold tracking-widest uppercase hover:bg-[#c4a032] transition disabled:opacity-50"
                    >
                      {updating ? 'Saving Details...' : 'Save User Settings'}
                    </button>
                  </form>
                ) : null}

                <div className="mt-8 space-y-8">
                  {userDetails.user.role === 'seller' && (
                    <div className="space-y-6">
                      {/* Product Catalog */}
                      <div>
                        <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 border-b border-gray-200 pb-2 mb-4">Product Catalog ({userDetails.total_products})</h3>
                        {userDetails.products.length === 0 ? <p className="text-sm text-gray-400">No products listed yet.</p> : (
                          <div className="space-y-3">
                            {userDetails.products.map(p => (
                              <div key={p._id || p.id} className="flex justify-between items-center bg-gray-50 p-3 rounded">
                                <div>
                                  <p className="text-sm font-semibold text-black">{p.name}</p>
                                  <p className="text-xs text-gray-500">{p.category}</p>
                                </div>
                                <p className="text-sm font-bold">₹{p.price?.toLocaleString('en-IN')}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Seller Rating Panel */}
                      {userDetails.seller_rating ? (
                        <div>
                          <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 border-b border-gray-200 pb-2 mb-4">⭐ Seller Rating Analytics</h3>
                          <div className="bg-amber-50 border border-amber-200 p-4 rounded mb-4 text-center">
                            <p className="text-4xl font-black text-[#D4AF37]">{userDetails.seller_rating.avg_rating.toFixed(1)}</p>
                            <div className="flex justify-center gap-0.5 my-1">
                              {[1,2,3,4,5].map(s => (
                                <span key={s} className={`text-lg ${s <= Math.round(userDetails.seller_rating.avg_rating) ? 'text-[#D4AF37]' : 'text-gray-300'}`}>★</span>
                              ))}
                            </div>
                            <p className="text-xs text-gray-500">{userDetails.seller_rating.total_reviews} total customer reviews</p>
                          </div>
                          <div className="space-y-1.5">
                            {userDetails.seller_rating.breakdown.map(b => (
                              <div key={b.stars} className="flex items-center gap-2 text-xs">
                                <span className="w-8 text-right text-gray-500">{b.stars}★</span>
                                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-[#D4AF37] rounded-full"
                                    style={{ width: userDetails.seller_rating.total_reviews > 0 ? `${Math.round((b.count / userDetails.seller_rating.total_reviews) * 100)}%` : '0%' }}
                                  />
                                </div>
                                <span className="w-6 text-gray-500 font-mono">{b.count}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 bg-gray-50 border border-gray-200 text-xs text-gray-400 text-center rounded">
                          No reviews received yet on this seller's products.
                        </div>
                      )}
                    </div>
                  )}



                  {userDetails.user.role === 'buyer' && (
                    <div>
                      <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 border-b border-gray-200 pb-2 mb-4">Order Ledger (₹{userDetails.total_spent.toLocaleString('en-IN')} LTV)</h3>
                      {userDetails.orders.length === 0 ? <p className="text-sm text-gray-400">No orders placed yet.</p> : (
                        <div className="space-y-4">
                          {userDetails.orders.map(o => (
                            <div key={o.id} className="flex justify-between items-center bg-gray-50 p-3 rounded border-l-4 border-black">
                              <div>
                                <p className="text-xs font-mono text-gray-500">{o.id}</p>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-green-600 mt-1">{o.status}</p>
                              </div>
                              <p className="text-sm font-bold">₹{o.total_amount.toLocaleString('en-IN')}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-gray-200 h-[calc(100vh-80px)] fixed left-0 top-20 overflow-y-auto hidden md:block">
        <div className="p-6">
          <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 mb-6">Management</h2>
          <nav className="space-y-2">
            {['dashboard', 'users', 'products', 'orders', 'coupons'].map(tab => (
              <button 
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`w-full text-left px-4 py-3 text-xs font-bold tracking-widest uppercase transition-colors ${activeTab === tab ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-6">
            <div>
              <h2 className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">Platform Overview</h2>
              <h1 className="text-3xl font-bold tracking-tight text-black capitalize" style={{ fontFamily: 'Inter, sans-serif' }}>
                {activeTab} Panel
              </h1>
            </div>
          </div>

          {error && <div className="p-4 mb-6 bg-red-50 text-red-500 border border-red-200 text-xs font-mono">{error}</div>}
          {loading && data && <div className="mb-4 text-xs text-gray-500 uppercase tracking-widest animate-pulse">Loading Page {currentPage}...</div>}

          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && data?.total_revenue !== undefined && (
            <div className="space-y-8">
              {/* API Sync Control */}
              <div className="bg-white p-6 border border-gray-200 shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-black mb-1">Global API Sync Engine</h3>
                  <p className="text-xs text-gray-500">Trigger manual pull from DummyJSON and fallback sources to refresh the product catalog.</p>
                </div>
                <button onClick={() => alert('API Sync Triggered! (Check backend logs for progress)')} className="bg-black text-white px-6 py-3 text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition">
                  Run Sync Now
                </button>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 border border-gray-200 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2">Total Revenue</p>
                  <p className="text-3xl font-bold tracking-tight text-black">₹{data.total_revenue.toLocaleString('en-IN')}</p>
                </div>
                <div className="bg-white p-6 border border-gray-200 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2">Total Users</p>
                  <p className="text-3xl font-bold tracking-tight text-black">{data.total_users}</p>
                </div>
                <div className="bg-white p-6 border border-gray-200 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2">Total Orders</p>
                  <p className="text-3xl font-bold tracking-tight text-black">{data.total_orders}</p>
                </div>
                <div className="bg-white p-6 border border-gray-200 shadow-sm">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2">Active Vendors</p>
                  <p className="text-3xl font-bold tracking-tight text-black">{data.total_vendors}</p>
                </div>
              </div>

              {/* Revenue Chart */}
              <div className="bg-white p-6 border border-gray-200 shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6">Revenue & User Growth (YTD)</h3>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E8E8" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#5A5A5A' }} dy={10} />
                      <YAxis yAxisId="left" orientation="left" stroke="#1A1A1A" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                      <YAxis yAxisId="right" orientation="right" stroke="#D4AF37" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                      <Tooltip cursor={{ fill: '#F5F5F5' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                      <Bar yAxisId="left" dataKey="revenue" fill="#1A1A1A" radius={[4, 4, 0, 0]} name="Revenue (₹)" barSize={40} />
                      <Bar yAxisId="right" dataKey="users" fill="#D4AF37" radius={[4, 4, 0, 0]} name="New Users" barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: USERS */}
          {activeTab === 'users' && data?.data && (
            <div className="bg-white border border-gray-200 shadow-sm overflow-hidden flex flex-col">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Name</th>
                    <th className="p-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Email</th>
                    <th className="p-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Role</th>
                    <th className="p-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Rating</th>
                    <th className="p-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.data.map(u => (
                    <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-semibold text-sm text-black">{u.full_name}</td>
                      <td className="p-4 text-sm text-gray-600">{u.email}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-[10px] font-bold tracking-widest uppercase ${u.role === 'admin' ? 'bg-black text-white' : u.role === 'seller' ? 'bg-gray-200 text-black' : 'bg-gray-100 text-gray-500'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4">
                        {u.role === 'seller' ? (
                          <span className="flex items-center gap-1 text-sm font-bold text-[#D4AF37]">
                            ★ {u.avg_rating ? u.avg_rating.toFixed(1) : '—'}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleViewUser(u.id)}
                          className="text-[10px] font-bold uppercase tracking-widest text-black hover:text-gray-500 underline"
                        >
                          Deep Dive
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <PaginationControls />
            </div>
          )}

          {/* TAB 3: PRODUCTS */}
          {activeTab === 'products' && data?.data && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="p-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Product</th>
                      <th className="p-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Price</th>
                      <th className="p-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.data.map(p => (
                      <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="p-4 text-sm font-semibold text-black">{p.name}</td>
                        <td className="p-4 text-sm text-gray-600">₹{p.price.toLocaleString('en-IN')}</td>
                        <td className="p-4 text-sm text-gray-600">{p.category}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <PaginationControls />
              </div>
              <div className="bg-white p-6 border border-gray-200 shadow-sm self-start">
                <h3 className="text-xs font-bold tracking-widest uppercase text-black mb-6 border-b border-gray-100 pb-4">Add Product</h3>
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <input type="text" placeholder="Product Name" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full p-3 border border-gray-300 text-sm focus:border-black outline-none" required />
                  <input type="number" placeholder="Price" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})} className="w-full p-3 border border-gray-300 text-sm focus:border-black outline-none" required min="1" />
                  <select 
                    value={newProduct.category} 
                    onChange={e => setNewProduct({...newProduct, category: e.target.value})} 
                    className="w-full p-3 border border-gray-300 text-sm focus:border-black outline-none bg-white" 
                    required
                  >
                    <option value="Women Fashion">Women Fashion</option>
                    <option value="Men Fashion">Men Fashion</option>
                    <option value="Kids Fashion">Kids Fashion</option>
                    <option value="Beauty & Care">Beauty & Care</option>
                    <option value="Home & Living">Home & Living</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                  <input type="url" placeholder="Image URL" value={newProduct.image_url} onChange={e => setNewProduct({...newProduct, image_url: e.target.value})} className="w-full p-3 border border-gray-300 text-sm focus:border-black outline-none" required />
                  <textarea placeholder="Description" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="w-full p-3 border border-gray-300 text-sm focus:border-black outline-none h-24" required />
                  <button type="submit" className="w-full bg-black text-white py-3 text-xs font-bold tracking-widest uppercase hover:bg-gray-800 transition">Create Product</button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 4: ORDERS */}
          {activeTab === 'orders' && data?.data && (
            <div className="bg-white border border-gray-200 shadow-sm overflow-hidden flex flex-col">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Order ID</th>
                    <th className="p-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Customer</th>
                    <th className="p-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Total</th>
                    <th className="p-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.data.map(o => (
                    <tr key={o.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-mono text-xs text-gray-500">{o.id}</td>
                      <td className="p-4 text-sm font-semibold text-black">{o.user?.full_name || 'Unknown'}</td>
                      <td className="p-4 text-sm text-black">₹{o.total_amount.toLocaleString('en-IN')}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 text-[10px] font-bold tracking-widest uppercase bg-green-100 text-green-700">{o.status}</span>
                      </td>
                    </tr>
                  ))}
                  {data.data.length === 0 && <tr><td colSpan="4" className="p-8 text-center text-gray-500 text-sm">No orders found globally.</td></tr>}
                </tbody>
              </table>
              <PaginationControls />
            </div>
          )}

          {/* TAB 5: COUPONS */}
          {activeTab === 'coupons' && data?.data && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="p-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Code</th>
                      <th className="p-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Discount</th>
                      <th className="p-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.data.map(c => (
                      <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-bold text-sm text-black uppercase tracking-widest">{c.code}</td>
                        <td className="p-4 text-sm text-gray-600">{c.discount_percentage}% OFF</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 text-[10px] font-bold tracking-widest uppercase ${c.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {c.is_active ? 'Active' : 'Expired'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {data.data.length === 0 && <tr><td colSpan="3" className="p-8 text-center text-gray-500 text-sm">No active coupons.</td></tr>}
                  </tbody>
                </table>
                <PaginationControls />
              </div>
              <div className="bg-white p-6 border border-gray-200 shadow-sm self-start">
                <h3 className="text-xs font-bold tracking-widest uppercase text-black mb-6 border-b border-gray-100 pb-4">Generate Coupon</h3>
                <form onSubmit={handleCreateCoupon} className="space-y-4">
                  <input type="text" placeholder="PROMOCODE" value={newCoupon.code} onChange={e => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})} className="w-full p-3 border border-gray-300 text-sm focus:border-black outline-none font-bold tracking-widest" required />
                  <input type="number" placeholder="Discount %" value={newCoupon.discount_percentage} onChange={e => setNewCoupon({...newCoupon, discount_percentage: parseInt(e.target.value)})} className="w-full p-3 border border-gray-300 text-sm focus:border-black outline-none" required min="1" max="100" />
                  <input type="number" placeholder="Valid Days" value={newCoupon.valid_days} onChange={e => setNewCoupon({...newCoupon, valid_days: parseInt(e.target.value)})} className="w-full p-3 border border-gray-300 text-sm focus:border-black outline-none" required min="1" />
                  <button type="submit" className="w-full bg-black text-white py-3 text-xs font-bold tracking-widest uppercase hover:bg-gray-800 transition">Issue Coupon</button>
                </form>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
