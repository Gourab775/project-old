import { Trash2, Minus, Plus } from "lucide-react";
import { motion } from "framer-motion";
import type { CartItem } from "../../context/CartContext";
import { useCart } from "../../context/CartContext";

interface CartItemCardProps {
  item: CartItem;
}

export function CartItemCard({ item }: CartItemCardProps) {
  const { addToCart, decreaseQty, removeFromCart } = useCart();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.2 }}
      className="flex gap-4 bg-card rounded-3xl border border-border/40 shadow-sm p-4"
    >
      {/* Item image */}
      <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-secondary">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src =
              "https://via.placeholder.com/80x80/f97316/ffffff?text=Food";
          }}
        />
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            {/* Veg/Non-veg indicator + name */}
            <div className="flex items-center gap-1.5 mb-0.5">
              <div
                className={`w-3 h-3 rounded-sm border-2 flex items-center justify-center shrink-0 ${
                  item.isVeg ? "border-green-600" : "border-red-600"
                }`}
              >
                <div
                  className={`w-1 h-1 rounded-full ${
                    item.isVeg ? "bg-green-600" : "bg-red-600"
                  }`}
                />
              </div>
              <span className="font-bold text-foreground leading-tight">
                {item.name}
              </span>
            </div>

            <span className="text-sm text-muted-foreground">
              ₹{item.price} × {item.quantity}
            </span>
            <span className="ml-2 font-bold text-primary">
              = ₹{item.price * item.quantity}
            </span>
          </div>

          {/* Remove button */}
          <button
            onClick={() => removeFromCart(item.id)}
            aria-label="Remove item"
            className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Quantity stepper */}
        <div className="flex items-center self-end bg-secondary rounded-xl p-1 mt-2">
          <button
            onClick={() => decreaseQty(item.id)}
            aria-label="Decrease quantity"
            className="w-8 h-8 rounded-lg bg-background shadow-sm flex items-center justify-center text-foreground hover:bg-muted transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-9 text-center font-bold text-sm text-foreground">
            {item.quantity}
          </span>
          <button
            onClick={() => addToCart(item)}
            aria-label="Increase quantity"
            className="w-8 h-8 rounded-lg bg-primary shadow-sm flex items-center justify-center text-white hover:opacity-90 transition-opacity"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
