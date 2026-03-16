import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, ChevronRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useLocation } from "wouter";

/**
 * Floating "View Cart" bar that appears at the bottom of the menu page
 * whenever the cart has items. Tapping it navigates to /cart.
 */
export function CartDrawer() {
  const { totalItems, grandTotal } = useCart();
  const [, navigate] = useLocation();

  return (
    <AnimatePresence>
      {totalItems > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 22, stiffness: 200 }}
          className="fixed bottom-6 inset-x-0 px-4 z-50 pointer-events-none max-w-3xl mx-auto"
        >
          <button
            onClick={() => navigate("/cart")}
            className="w-full bg-gradient-to-r from-primary to-orange-400 text-white rounded-2xl p-4 shadow-xl shadow-primary/30 flex items-center justify-between pointer-events-auto hover:-translate-y-0.5 active:scale-[0.98] transition-transform"
          >
            {/* Left: item count + price */}
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-xs text-white/80 font-medium">
                  {totalItems} Item{totalItems !== 1 ? "s" : ""} added
                </p>
                <p className="font-bold text-lg leading-none">
                  ₹{grandTotal}
                </p>
              </div>
            </div>

            {/* Right: CTA */}
            <div className="flex items-center gap-1 font-bold text-base">
              View Cart <ChevronRight className="w-5 h-5" />
            </div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
