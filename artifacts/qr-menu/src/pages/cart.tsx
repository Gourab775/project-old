import { useLocation } from "wouter";
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";

export function CartPage() {
  const [, navigate] = useLocation();
  const { cart, addToCart, decrementQuantity, removeFromCart, clearCart, totalItems, totalPrice } = useCart();

  const tax = Math.round(totalPrice * 0.05);
  const grandTotal = totalPrice + tax;

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-3xl mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 h-16 flex items-center gap-4">
        <button
          onClick={() => navigate("/")}
          className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors"
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
          <div className="flex flex-col items-center justify-center h-full py-32 gap-4 px-6 text-center">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
              <ShoppingBag className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Cart is empty</h2>
            <p className="text-muted-foreground">
              Looks like you haven't added anything yet.
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-2 bg-primary text-primary-foreground font-bold px-6 py-3 rounded-2xl shadow-md shadow-primary/25 hover:opacity-90 transition-opacity"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="px-4 py-6 space-y-4">
            <AnimatePresence initial={false}>
              {cart.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.2 }}
                  className="flex gap-4 bg-card rounded-3xl border border-border/40 shadow-sm p-4"
                >
                  <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-secondary">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <div
                            className={`w-3 h-3 rounded-sm border-2 flex items-center justify-center ${
                              item.isVeg ? "border-green-600" : "border-red-600"
                            }`}
                          >
                            <div
                              className={`w-1 h-1 rounded-full ${
                                item.isVeg ? "bg-green-600" : "bg-red-600"
                              }`}
                            />
                          </div>
                          <span className="font-bold text-foreground">
                            {item.name}
                          </span>
                        </div>
                        <span className="text-primary font-semibold text-sm">
                          ₹{item.price} × {item.quantity} ={" "}
                          <span className="font-bold">
                            ₹{item.price * item.quantity}
                          </span>
                        </span>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center self-end bg-secondary rounded-xl p-1 mt-2">
                      <button
                        onClick={() => decrementQuantity(item.id)}
                        className="w-8 h-8 rounded-lg bg-background shadow-sm flex items-center justify-center text-foreground hover:bg-muted transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-9 text-center font-bold text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => addToCart(item)}
                        className="w-8 h-8 rounded-lg bg-primary shadow-sm flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Bill Summary */}
            <div className="mt-8 bg-card rounded-3xl border border-border/40 shadow-sm p-5 space-y-3">
              <h3 className="font-bold text-foreground text-lg mb-4">
                Bill Summary
              </h3>
              <div className="flex justify-between text-muted-foreground">
                <span>
                  Subtotal ({totalItems} item{totalItems > 1 ? "s" : ""})
                </span>
                <span>₹{totalPrice}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>GST & Taxes (5%)</span>
                <span>₹{tax}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery fee</span>
                <span className="text-green-600 font-semibold">FREE</span>
              </div>
              <div className="pt-3 border-t border-border/50 flex justify-between font-bold text-foreground text-lg">
                <span>Total to pay</span>
                <span className="text-primary">₹{grandTotal}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Checkout Footer */}
      {cart.length > 0 && (
        <div className="sticky bottom-0 px-4 pb-8 pt-4 bg-background border-t border-border/50">
          <button
            onClick={() => {
              alert("Order placed! Thank you. 🎉");
              clearCart();
              navigate("/");
            }}
            className="w-full bg-gradient-to-r from-primary to-orange-400 text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/25 hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            Place Order • ₹{grandTotal}
          </button>
        </div>
      )}
    </div>
  );
}
