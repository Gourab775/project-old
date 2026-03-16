import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
} from "react";
import type { MenuItem } from "../services/menuService";

export type CartItem = MenuItem & { quantity: number };

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: MenuItem) => void;
  increaseQty: (itemId: string) => void;
  decreaseQty: (itemId: string) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  subtotal: number;
  tax: number;
  grandTotal: number;

  // App-wide UI state
  vegMode: boolean;
  setVegMode: (val: boolean) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;

  // Legacy alias kept for compatibility
  decrementQuantity: (itemId: string) => void;
};

const STORAGE_KEY = "qr-menu-cart";

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function saveCart(cart: CartItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  } catch {
    // storage unavailable — silent fail
  }
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(loadCart);
  const [vegMode, setVegMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Persist cart to localStorage on every change
  useEffect(() => {
    saveCart(cart);
  }, [cart]);

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

  const increaseQty = (itemId: string) => {
    setCart((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i))
    );
  };

  const decreaseQty = (itemId: string) => {
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

  const totalItems = useMemo(
    () => cart.reduce((acc, i) => acc + i.quantity, 0),
    [cart]
  );
  const subtotal = useMemo(
    () => cart.reduce((acc, i) => acc + i.price * i.quantity, 0),
    [cart]
  );
  const tax = useMemo(() => Math.round(subtotal * 0.05), [subtotal]);
  const grandTotal = useMemo(() => subtotal + tax, [subtotal, tax]);
  const totalPrice = subtotal;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increaseQty,
        decreaseQty,
        removeFromCart,
        clearCart,
        totalItems,
        totalPrice,
        subtotal,
        tax,
        grandTotal,
        vegMode,
        setVegMode,
        searchQuery,
        setSearchQuery,
        decrementQuantity: decreaseQty,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
