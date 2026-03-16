import { ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const { totalItems } = useCart();
  const [, navigate] = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-b border-border/50 transition-all duration-300">
      <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3 focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-orange-400 p-2 shadow-lg shadow-primary/20 flex items-center justify-center">
            <img
              src={`${import.meta.env.BASE_URL}images/logo.png`}
              alt="FlavorBite"
              className="w-full h-full object-contain brightness-0 invert"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
          <div className="text-left">
            <h1 className="font-display font-bold text-xl text-foreground leading-tight">
              FlavorBite
            </h1>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
              Premium Dining
            </p>
          </div>
        </button>

        {/* Cart icon with badge → navigates to /cart */}
        <button
          onClick={() => navigate("/cart")}
          className="relative p-2 rounded-full hover:bg-secondary transition-colors duration-200"
          aria-label={`Cart — ${totalItems} item${totalItems !== 1 ? "s" : ""}`}
        >
          <ShoppingBag className="w-6 h-6 text-foreground" />

          <AnimatePresence>
            {totalItems > 0 && (
              <motion.div
                key="badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute top-1 right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center border-2 border-background"
              >
                <span className="text-[9px] font-bold text-primary-foreground leading-none">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    </header>
  );
}
