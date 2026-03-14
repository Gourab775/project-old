import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import type { MenuItem } from "../data/menuData";
import { useCart } from "../context/CartContext";

export function MenuItemCard({ item }: { item: MenuItem }) {
  const { cart, addToCart, decrementQuantity } = useCart();
  
  const cartItem = cart.find(i => i.id === item.id);
  const quantity = cartItem?.quantity || 0;

  return (
    <div className={`p-4 bg-card rounded-3xl shadow-sm border border-border/40 hover:shadow-md transition-all duration-300 flex gap-4 ${!item.isAvailable ? 'opacity-70 grayscale-[0.3]' : ''}`}>
      
      {/* Left: Image */}
      <div className="relative w-28 h-28 shrink-0 rounded-2xl overflow-hidden bg-secondary">
        <img 
          src={item.imageUrl} 
          alt={item.name} 
          className="w-full h-full object-cover"
        />
        {/* Availability overlay */}
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-bold text-xs bg-black/60 px-2 py-1 rounded-md">Sold Out</span>
          </div>
        )}
      </div>

      {/* Right: Content */}
      <div className="flex-1 flex flex-col justify-between py-1">
        <div>
          <div className="flex justify-between items-start gap-2">
            <div className="flex items-center gap-2">
              {/* Indian Menu Veg/Non-Veg Mark */}
              <div className={`w-3.5 h-3.5 rounded-sm border-2 flex items-center justify-center shrink-0 ${item.isVeg ? 'border-green-600' : 'border-red-600'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
              </div>
              <h3 className="font-bold text-foreground leading-tight">{item.name}</h3>
            </div>
          </div>
          
          <div className="text-primary font-bold mt-1">₹{item.price}</div>
          <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Action Button */}
        <div className="mt-3 flex justify-end items-center">
          {quantity > 0 ? (
            <div className="flex items-center bg-primary/10 rounded-xl p-1 border border-primary/20">
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={() => decrementQuantity(item.id)}
                className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-primary shadow-sm"
              >
                <Minus className="w-4 h-4" />
              </motion.button>
              <span className="w-8 text-center font-bold text-primary">{quantity}</span>
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={() => item.isAvailable && addToCart(item)}
                disabled={!item.isAvailable}
                className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-sm"
              >
                <Plus className="w-4 h-4" />
              </motion.button>
            </div>
          ) : (
            <motion.button 
              whileTap={item.isAvailable ? { scale: 0.95 } : undefined}
              onClick={() => item.isAvailable && addToCart(item)}
              disabled={!item.isAvailable}
              className={`px-5 py-2 rounded-xl font-bold text-sm shadow-sm transition-colors ${
                item.isAvailable 
                  ? 'bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white' 
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              }`}
            >
              Add +
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
