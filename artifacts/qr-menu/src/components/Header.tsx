import { ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { motion } from "framer-motion";

export function Header() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-b border-border/50 transition-all duration-300">
      <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-orange-400 p-2 shadow-lg shadow-primary/20 flex items-center justify-center">
             {/* Instead of generic icon, using the generated image */}
             <img 
               src={`${import.meta.env.BASE_URL}images/logo.png`} 
               alt="Restaurant Logo" 
               className="w-full h-full object-contain brightness-0 invert"
               onError={(e) => {
                 // Fallback if image not yet generated
                 e.currentTarget.style.display = 'none';
               }}
             />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl text-foreground leading-tight">FlavorBite</h1>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Premium Dining</p>
          </div>
        </div>

        {/* Cart Icon */}
        <button className="relative p-2 rounded-full hover:bg-secondary transition-colors duration-200">
          <ShoppingBag className="w-6 h-6 text-foreground" />
          {totalItems > 0 && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-1 right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center border-2 border-background"
            >
              <span className="text-[9px] font-bold text-primary-foreground">{totalItems}</span>
            </motion.div>
          )}
        </button>
      </div>
    </header>
  );
}
