import React from 'react';
import { motion } from 'framer-motion';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';

export default function ProductCard({ product }) {
  const addItem = useCartStore(state => state.addItem);
  const toggleWishlist = useWishlistStore(state => state.toggleItem);
  const inWishlist = useWishlistStore(state => state.items.some(i => i.id === product.id));

  return (
    <motion.div
      className="group cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative overflow-hidden mb-3 aspect-[3/4] bg-gray-100">
        <img
          src={product.image_url || '/placeholder.jpg'}
          alt={product.name}
          className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/400x533?text=Item' }}
        />

        {/* Hover Overlay - 'Impulse' style quick add could go here, but we keep it clean */}
        <div className="absolute inset-0 bg-black/5 transition duration-300 opacity-0 group-hover:opacity-100" />
        
        {/* Wishlist Button */}
        <button 
          onClick={(e) => { e.preventDefault(); toggleWishlist(product); }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm hover:scale-110 transition opacity-0 group-hover:opacity-100"
        >
          {inWishlist ? '❤️' : '♡'}
        </button>

        {/* Quick Add Button */}
        <div className="absolute bottom-4 left-0 w-full px-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <button 
            onClick={(e) => { e.preventDefault(); addItem(product); }}
            className="w-full bg-white text-black text-xs font-semibold uppercase tracking-wider py-3 hover:bg-black hover:text-white transition-colors"
          >
            Quick Add
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="text-left space-y-1">
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-1" style={{ fontFamily: 'Inter, sans-serif' }}>
          {product.name}
        </h3>
        <div className="text-sm text-gray-600">
          ₹{parseFloat(product.price).toLocaleString('en-IN')}
        </div>
      </div>
    </motion.div>
  );
}
