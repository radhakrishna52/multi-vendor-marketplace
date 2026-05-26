import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, RotateCcw, AlertTriangle, Grid } from 'lucide-react';
import apiClient from '../utils/api';
import ProductCard from '../components/ProductCard';

const CATEGORIES = [
  { id: 'All', label: 'All Catalog', icon: '✨' },
  { id: 'Women Fashion', label: 'Women', icon: '👗' },
  { id: 'Men Fashion', label: 'Men', icon: '👔' },
  { id: 'Kids Fashion', label: 'Kids', icon: '🧸' },
  { id: 'Beauty & Care', label: 'Beauty & Care', icon: '💄' },
  { id: 'Home & Living', label: 'Home & Living', icon: '🛋️' },
  { id: 'Accessories', label: 'Accessories', icon: '⌚' }
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Read search & category directly from URL search params
  const activeCategory = searchParams.get('category') || 'All';
  const searchQuery = searchParams.get('search') || '';
  
  // Local state for search input to allow smooth typing before debouncing
  const [searchInput, setSearchInput] = useState(searchQuery);

  // Sync search input with search param changes (e.g. from nav search bar)
  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  // Debounce search input and update URL params
  useEffect(() => {
    const handler = setTimeout(() => {
      const params = {};
      if (activeCategory !== 'All') params.category = activeCategory;
      if (searchInput.trim()) params.search = searchInput.trim();
      setSearchParams(params);
    }, 450);

    return () => clearTimeout(handler);
  }, [searchInput, activeCategory, setSearchParams]);

  // Fetch products from database when category or search term changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const queryParams = new URLSearchParams();
        queryParams.append('limit', '80');
        if (activeCategory !== 'All') queryParams.append('category', activeCategory);
        if (searchQuery.trim()) queryParams.append('search', searchQuery.trim());

        const response = await apiClient.get(`/api/products?${queryParams.toString()}`);
        setProducts(response.data.data || []);
      } catch (err) {
        console.error('Error fetching products', err);
        setError('Failed to fetch luxury collections. Please check your network connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory, searchQuery]);

  const handleCategorySelect = (catId) => {
    const params = {};
    if (catId !== 'All') params.category = catId;
    if (searchInput.trim()) params.search = searchInput.trim();
    setSearchParams(params);
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  // Skeleton grid component for loading state
  const ProductSkeletonGrid = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="flex flex-col space-y-4">
          <div className="skeleton rounded-2xl aspect-[3/4] w-full" />
          <div className="skeleton h-4 w-3/4 rounded" />
          <div className="skeleton h-4 w-1/4 rounded" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="pt-28 pb-24 px-4 min-h-screen bg-[#FAFAF8] dark:bg-gray-900 transition-colors duration-300 text-black dark:text-white">
      <div className="max-w-[1500px] mx-auto">
        
        {/* Banner Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6 border-b border-gray-150 dark:border-gray-800 pb-8">
          <div>
            <h2 className="text-xs font-bold tracking-[0.25em] uppercase text-yellow-600 dark:text-yellow-400">DreamCart Catalogue</h2>
            <h1 className="text-4xl md:text-5xl font-bold font-display tracking-tight text-gray-950 dark:text-white mt-1">
              {activeCategory === 'All' ? 'All Collections' : activeCategory}
            </h1>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80 shrink-0">
            <input 
              type="text" 
              placeholder="Search luxury collections..." 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-850 border border-gray-250 dark:border-gray-800 text-sm text-black dark:text-white rounded-xl focus:outline-none focus:border-yellow-500 dark:focus:border-yellow-400 focus:ring-1 focus:ring-yellow-500/30 transition shadow-sm"
            />
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Premium Horizontal Scrolling Category Pill Bar */}
        <div className="mb-12 overflow-x-auto pb-4 scrollbar-hide">
          <div className="flex gap-3 min-w-max">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`relative px-5 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2.5 transition-all duration-300 ${
                    isActive 
                      ? 'bg-black text-white dark:bg-white dark:text-black shadow-md scale-102 font-extrabold' 
                      : 'bg-white dark:bg-gray-850 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-700'
                  }`}
                >
                  <span className="text-base">{cat.icon}</span>
                  {cat.label}
                  {isActive && (
                    <motion.span 
                      layoutId="activePillGlow"
                      className="absolute inset-0 rounded-2xl ring-2 ring-yellow-500/20 dark:ring-yellow-400/40 pointer-events-none"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic State Renders */}
        <AnimatePresence mode="wait">
          {error ? (
            <motion.div 
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-16 flex flex-col items-center justify-center text-center space-y-4 max-w-md mx-auto"
            >
              <div className="w-12 h-12 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-full flex items-center justify-center text-red-500">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-gray-750 dark:text-gray-300">{error}</p>
              <button 
                onClick={() => handleCategorySelect(activeCategory)}
                className="px-5 py-2.5 bg-black dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-widest rounded-xl hover:opacity-90"
              >
                Retry Request
              </button>
            </motion.div>
          ) : loading ? (
            <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ProductSkeletonGrid />
            </motion.div>
          ) : products.length === 0 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-24 text-center max-w-md mx-auto space-y-5"
            >
              <div className="w-14 h-14 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center rounded-full mx-auto text-gray-400">
                <Grid className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">No Products Found</h3>
                <p className="text-xs text-gray-500 dark:text-gray-450 mt-1">
                  We couldn't find any premium goods matching "{activeCategory}" with search term "{searchQuery}".
                </p>
              </div>
              <button 
                onClick={handleResetFilters}
                className="inline-flex items-center gap-2 px-5 py-3 bg-black dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-widest rounded-xl hover:opacity-90 transition-opacity shadow-md"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset All Filters
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="products"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
            >
              {products.map((product) => (
                <div key={product.id || product._id} className="relative">
                  <ProductCard product={product} />
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
