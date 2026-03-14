import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X, ChevronRight, Minus, Plus } from "lucide-react";
import { useCart } from "../context/CartContext";

export function CartDrawer() {
  const { cart, totalItems, totalPrice, addToCart, decrementQuantity } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  // Prevent background scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (totalItems === 0) {
    if (isOpen) setIsOpen(false);
    return null;
  }

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-6 inset-x-0 px-4 z-50 pointer-events-none max-w-3xl mx-auto"
          >
            <button 
              onClick={() => setIsOpen(true)}
              className="w-full bg-gradient-to-r from-primary to-orange-400 text-white rounded-2xl p-4 shadow-xl shadow-primary/30 flex items-center justify-between pointer-events-auto hover:-translate-y-1 transition-transform"
            >
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-white/80 font-medium">{totalItems} Item{totalItems > 1 ? 's' : ''}</p>
                  <p className="font-bold text-lg leading-none">₹{totalPrice}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 font-bold">
                View Cart <ChevronRight className="w-5 h-5" />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 inset-x-0 h-[85vh] bg-background rounded-t-3xl z-[70] flex flex-col shadow-2xl max-w-3xl mx-auto border-t border-border"
            >
              {/* Handle bar */}
              <div className="w-full flex justify-center py-3" onClick={() => setIsOpen(false)}>
                <div className="w-12 h-1.5 bg-border rounded-full" />
              </div>

              {/* Header */}
              <div className="px-6 pb-4 flex items-center justify-between border-b border-border/50">
                <h2 className="font-display text-2xl font-bold text-foreground">Your Order</h2>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 items-start">
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-secondary">
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-foreground">{item.name}</h4>
                        <span className="font-bold text-primary">₹{item.price * item.quantity}</span>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-sm text-muted-foreground">₹{item.price} each</span>
                        <div className="flex items-center bg-secondary rounded-lg p-1">
                          <button 
                            onClick={() => decrementQuantity(item.id)}
                            className="w-7 h-7 rounded-md bg-background shadow-sm flex items-center justify-center text-foreground hover:bg-muted"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                          <button 
                            onClick={() => addToCart(item)}
                            className="w-7 h-7 rounded-md bg-background shadow-sm flex items-center justify-center text-foreground hover:bg-muted"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="h-px w-full bg-border/50 my-6" />
                
                <div className="space-y-3">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>₹{totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Taxes & Fees</span>
                    <span>₹{Math.round(totalPrice * 0.05)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-foreground pt-3 border-t border-border/50">
                    <span>Total to pay</span>
                    <span>₹{totalPrice + Math.round(totalPrice * 0.05)}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 bg-background border-t border-border/50 pb-8">
                <button 
                  className="w-full bg-primary text-primary-foreground font-bold py-4 rounded-2xl shadow-lg shadow-primary/25 hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  onClick={() => {
                    alert("Proceeding to checkout!");
                    setIsOpen(false);
                  }}
                >
                  Place Order <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
