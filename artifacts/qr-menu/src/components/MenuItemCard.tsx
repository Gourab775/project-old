import { useState, memo } from "react";
import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import type { MenuItem } from "../services/menuService";
import { useCart } from "../context/CartContext";

export const MenuItemCard = memo(function MenuItemCard({
  item,
}: {
  item: MenuItem;
}) {
  const { cart, addToCart, decrementQuantity } = useCart();
  const [imgLoaded, setImgLoaded] = useState(false);

  const cartItem = cart.find((i) => i.id === item.id);
  const quantity = cartItem?.quantity ?? 0;

  return (
    <div
      className={`p-4 bg-card rounded-3xl shadow-sm border border-border/40 hover:shadow-md transition-shadow duration-300 flex gap-4 ${
        !item.isAvailable ? "opacity-60 grayscale-[0.3]" : ""
      }`}
    >
      {/* Image */}
      <div className="relative w-28 h-28 shrink-0 rounded-2xl overflow-hidden bg-secondary">
        {/* Placeholder shown while loading */}
        {!imgLoaded && (
          <div className="absolute inset-0 bg-muted animate-pulse rounded-2xl" />
        )}
        <img
          src={item.imageUrl}
          alt={item.name}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            imgLoaded ? "opacity-100" : "opacity-0"
          }`}
          onError={(e) => {
            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
              item.name
            )}&background=f97316&color=fff&size=112&bold=true`;
            setImgLoaded(true);
          }}
        />

        {/* Sold-out overlay */}
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-bold text-xs bg-black/60 px-2 py-1 rounded-md">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between py-1">
        <div>
          {/* Veg/Non-veg + name */}
          <div className="flex items-center gap-2 mb-1">
            <div
              className={`w-3.5 h-3.5 rounded-sm border-2 flex items-center justify-center shrink-0 ${
                item.isVeg ? "border-green-600" : "border-red-600"
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  item.isVeg ? "bg-green-600" : "bg-red-600"
                }`}
              />
            </div>
            <h3 className="font-bold text-foreground leading-tight text-sm">
              {item.name}
            </h3>
          </div>

          <div className="text-primary font-bold text-sm">₹{item.price}</div>

          <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Add / quantity control */}
        <div className="mt-3 flex justify-end items-center">
          {quantity > 0 ? (
            <div className="flex items-center bg-primary/10 rounded-xl p-1 border border-primary/20">
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => decrementQuantity(item.id)}
                className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-primary shadow-sm active:bg-primary/10"
              >
                <Minus className="w-4 h-4" />
              </motion.button>
              <span className="w-8 text-center font-bold text-primary text-sm">
                {quantity}
              </span>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => item.isAvailable && addToCart(item)}
                disabled={!item.isAvailable}
                className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-sm"
              >
                <Plus className="w-4 h-4" />
              </motion.button>
            </div>
          ) : (
            <motion.button
              whileTap={item.isAvailable ? { scale: 0.93 } : undefined}
              onClick={() => item.isAvailable && addToCart(item)}
              disabled={!item.isAvailable}
              className={`px-5 py-2 rounded-xl font-bold text-sm shadow-sm transition-colors ${
                item.isAvailable
                  ? "bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }`}
            >
              Add +
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
});
