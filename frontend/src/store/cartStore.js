import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set) => ({
      items: [],
      total: 0,

      addItem: (product, quantity = 1) => set((state) => {
        const existingItem = state.items.find(item => item.id === product.id);
        
        if (existingItem) {
          return {
            items: state.items.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
            total: state.total + (product.price * quantity),
          };
        }

        return {
          items: [...state.items, { ...product, quantity }],
          total: state.total + (product.price * quantity),
        };
      }),

      removeItem: (productId) => set((state) => {
        const itemToRemove = state.items.find(item => item.id === productId);
        if (!itemToRemove) return state;

        return {
          items: state.items.filter(item => item.id !== productId),
          total: state.total - (itemToRemove.price * itemToRemove.quantity),
        };
      }),

      updateQuantity: (productId, quantity) => set((state) => {
        const item = state.items.find(item => item.id === productId);
        if (!item) return state;

        const quantityDiff = quantity - item.quantity;

        return {
          items: state.items.map(i =>
            i.id === productId ? { ...i, quantity } : i
          ),
          total: state.total + (item.price * quantityDiff),
        };
      }),

      clearCart: () => set({ items: [], total: 0 }),
    }),
    {
      name: 'dreamcart-cart-storage',
    }
  )
);
