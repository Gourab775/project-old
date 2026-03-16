import { useLocation } from "wouter";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { CartItemCard } from "../components/cart/CartItemCard";
import { CartSummary } from "../components/cart/CartSummary";

export function CartPage() {
  const [, navigate] = useLocation();
  const { cart, clearCart, grandTotal } = useCart();

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-3xl mx-auto">
      {/* Sticky header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 h-16 flex items-center gap-4">
        <button
          onClick={() => navigate("/")}
          className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>

        <h1 className="font-bold text-xl text-foreground flex-1">Your Order</h1>

        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="text-sm text-destructive hover:text-destructive/80 font-medium transition-colors"
          >
            Clear all
          </button>
        )}
      </header>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        {cart.length === 0 ? (
          /* ── Empty state ── */
          <div className="flex flex-col items-center justify-center h-full py-32 gap-4 px-6 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-28 h-28 rounded-full bg-muted flex items-center justify-center"
            >
              <ShoppingBag className="w-12 h-12 text-muted-foreground" />
            </motion.div>
            <h2 className="text-2xl font-bold text-foreground">
              Your cart is empty
            </h2>
            <p className="text-muted-foreground max-w-xs">
              Looks like you haven't added anything yet. Explore our menu and
              add your favourites!
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-2 bg-primary text-primary-foreground font-bold px-8 py-3.5 rounded-2xl shadow-md shadow-primary/25 hover:opacity-90 transition-opacity"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          /* ── Cart items + bill ── */
          <div className="px-4 py-6 space-y-4 pb-36">
            <AnimatePresence initial={false}>
              {cart.map((item) => (
                <CartItemCard key={item.id} item={item} />
              ))}
            </AnimatePresence>

            <div className="pt-4">
              <CartSummary />
            </div>
          </div>
        )}
      </div>

      {/* Sticky checkout footer */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 inset-x-0 max-w-3xl mx-auto px-4 pb-8 pt-4 bg-background/95 backdrop-blur-xl border-t border-border/50">
          <button
            onClick={() => navigate("/checkout")}
            className="w-full bg-gradient-to-r from-primary to-orange-400 text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/25 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-between px-6"
          >
            <span className="text-white/90 text-sm font-medium">
              Proceed to Checkout
            </span>
            <span className="font-extrabold text-lg">₹{grandTotal}</span>
          </button>
        </div>
      )}
    </div>
  );
}
