import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useWishlistStore = create(
  persist(
    (set) => ({
      items: [],
      
      toggleItem: (product) => set((state) => {
        const exists = state.items.some(item => item.id === product.id);
        if (exists) {
          return { items: state.items.filter(item => item.id !== product.id) };
        }
        return { items: [...state.items, product] };
      }),
      
      removeItem: (productId) => set((state) => ({
        items: state.items.filter(item => item.id !== productId)
      })),
      
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'dreamcart-wishlist-storage',
    }
  )
);
