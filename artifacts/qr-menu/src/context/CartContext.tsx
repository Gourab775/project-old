import React, { createContext, useContext, useState, useMemo } from 'react';
import type { MenuItem } from '../services/menuService';

export type CartItem = MenuItem & { quantity: number };

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  decrementQuantity: (itemId: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  
  // App-wide UI state that affects the menu
  vegMode: boolean;
  setVegMode: (val: boolean) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [vegMode, setVegMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => 
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const decrementQuantity = (itemId: string) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === itemId);
      if (existing && existing.quantity > 1) {
        return prev.map((i) => 
          i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
        );
      }
      return prev.filter((i) => i.id !== itemId);
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((i) => i.id !== itemId));
  };

  const clearCart = () => setCart([]);

  const totalItems = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);
  const totalPrice = useMemo(() => cart.reduce((acc, item) => acc + (item.price * item.quantity), 0), [cart]);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      decrementQuantity,
      removeFromCart,
      clearCart,
      totalItems,
      totalPrice,
      vegMode,
      setVegMode,
      searchQuery,
      setSearchQuery
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
