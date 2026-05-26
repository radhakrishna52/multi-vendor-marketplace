import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { Trash2 } from 'lucide-react';

export default function Cart() {
  const { items, total, removeItem, updateQuantity } = useCartStore();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="pt-28 pb-20 px-4 min-h-[70vh] flex flex-col items-center justify-center text-center">
        <h2 className="text-3xl font-display mb-4">Your Cart is Empty</h2>
        <p className="text-text-secondary mb-8">Discover luxury pieces to add to your collection.</p>
        <Link to="/products" className="btn-gold">Explore Collection</Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 px-4 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-display mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <motion.div 
                key={item.id} 
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex gap-6 p-4 border border-border bg-white rounded-sm"
              >
                <div className="w-24 h-24 bg-cream flex-shrink-0">
                  <img 
                    src={item.image_url || '/placeholder.jpg'} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=DreamCart' }}
                  />
                </div>
                
                <div className="flex-grow flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs text-text-secondary uppercase tracking-widest">{item.category}</p>
                      <h3 className="font-heading font-semibold text-lg">{item.name}</h3>
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-text-secondary hover:text-rose-gold transition p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex items-center border border-border rounded-sm">
                      <button 
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="px-3 py-1 text-charcoal hover:bg-cream transition"
                      >
                        -
                      </button>
                      <span className="px-4 py-1 font-heading text-sm border-x border-border">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-3 py-1 text-charcoal hover:bg-cream transition"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-display text-xl text-gold">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-border p-6 sticky top-28 rounded-sm">
              <h2 className="font-heading font-bold text-lg mb-6">Order Summary</h2>
              
              <div className="space-y-4 text-sm mb-6 border-b border-border pb-6">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Subtotal</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Shipping</span>
                  <span>Complimentary</span>
                </div>
              </div>
              
              <div className="flex justify-between font-bold text-lg mb-8">
                <span>Total</span>
                <span className="text-gold">₹{total.toLocaleString('en-IN')}</span>
              </div>
              
              <button 
                onClick={() => navigate('/checkout')}
                className="w-full btn-gold py-3 justify-center text-sm"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
