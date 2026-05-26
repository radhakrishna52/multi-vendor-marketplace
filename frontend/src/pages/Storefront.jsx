import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import apiClient from '../utils/api';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuthStore } from '../store/authStore';

export default function Storefront() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await apiClient.get('/api/products?limit=8');
        setProducts(response.data.data || []);
      } catch (err) {
        console.error('Error fetching products', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="pt-28 pb-20 bg-white">
      {/* Personalized Header */}
      <section className="max-w-[1600px] mx-auto px-4 md:px-8 mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-b border-gray-200 pb-8"
        >
          <h2 className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">Welcome Back</h2>
          <h1 className="text-4xl font-bold tracking-tight text-black" style={{ fontFamily: 'Inter, sans-serif' }}>
            {user?.name || 'Customer'}
          </h1>
        </motion.div>
      </section>

      {/* Cute Category Circles */}
      <section className="max-w-[1600px] mx-auto px-4 md:px-8 mb-16">
        <div className="flex overflow-x-auto gap-8 pb-4 scrollbar-hide">
          {[
            { name: "Women Fashion", icon: "👗", color: "bg-pink-100" },
            { name: "Men Fashion", icon: "👔", color: "bg-blue-100" },
            { name: "Kids Fashion", icon: "🧸", color: "bg-yellow-100" },
            { name: "Beauty & Care", icon: "💄", color: "bg-purple-100" },
            { name: "Home & Living", icon: "🛋️", color: "bg-teal-100" },
            { name: "Accessories", icon: "⌚", color: "bg-orange-100" }
          ].map((cat, i) => (
            <Link 
              key={cat.name} 
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className="flex flex-col items-center gap-3 group min-w-[100px] shrink-0 cursor-pointer"
            >
              <div className={`w-24 h-24 rounded-full ${cat.color} flex items-center justify-center text-4xl shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300`}>
                {cat.icon}
              </div>
              <span className="text-sm font-semibold text-gray-700 tracking-wide">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Clean Featured Products Grid */}
      <section className="px-4 md:px-8 bg-white overflow-hidden">
        <div className="max-w-[1600px] mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex justify-between items-end mb-12 border-b border-gray-200 pb-4"
          >
            <div>
              <h2 className="text-sm font-bold tracking-widest uppercase text-gray-500 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>Curated For You</h2>
              <h3 className="text-3xl font-bold tracking-tight text-black" style={{ fontFamily: 'Inter, sans-serif' }}>Trending Goods</h3>
            </div>
            <Link to="/products" className="text-sm font-semibold hover:text-gray-500 transition-colors flex items-center gap-2 uppercase tracking-widest">Shop All <span className="text-xl">→</span></Link>
          </motion.div>
          
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true, margin: "-50px" }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
