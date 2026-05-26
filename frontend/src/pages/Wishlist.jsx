import React from 'react';
import { useWishlistStore } from '../store/wishlistStore';
import { useCartStore } from '../store/cartStore';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';

export default function Wishlist() {
  const items = useWishlistStore(state => state.items);
  const addItemToCart = useCartStore(state => state.addItem);

  return (
    <div className="pt-28 pb-20 px-4 min-h-[80vh]">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-display mb-8">Your Wishlist</h1>
        
        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-text-secondary mb-6">Your luxury wishlist is currently empty.</p>
            <Link to="/products" className="btn-gold">Explore Collections</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {items.map(product => (
              <div key={product.id} className="relative">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
