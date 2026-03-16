import { useLocation } from "wouter";
import { ArrowLeft, CheckCircle2, MapPin, Phone, Clock } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import { CartSummary } from "../components/cart/CartSummary";

export function CheckoutPage() {
  const [, navigate] = useLocation();
  const { cart, grandTotal, clearCart } = useCart();
  const [placed, setPlaced] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [table, setTable] = useState("");

  function handlePlaceOrder() {
    if (!name.trim() || !phone.trim()) return;
    setPlaced(true);
    setTimeout(() => {
      clearCart();
      navigate("/");
    }, 3000);
  }

  if (placed) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 px-6 text-center">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="w-28 h-28 bg-green-100 dark:bg-green-950/40 rounded-full flex items-center justify-center"
        >
          <CheckCircle2 className="w-14 h-14 text-green-500" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Order Placed! 🎉
          </h2>
          <p className="text-muted-foreground">
            Your food is being prepared. Redirecting you to the menu…
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-3xl mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50 px-4 h-16 flex items-center gap-4">
        <button
          onClick={() => navigate("/cart")}
          className="p-2 -ml-2 rounded-full hover:bg-secondary transition-colors"
          aria-label="Back to cart"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="font-bold text-xl text-foreground">Checkout</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5 pb-36">
        {/* Delivery info card */}
        <div className="bg-card rounded-3xl border border-border/40 shadow-sm p-5 space-y-4">
          <h3 className="font-bold text-foreground text-base flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" /> Order Details
          </h3>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Your Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1.5 w-full bg-secondary rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/40 transition-all text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                <Phone className="w-3 h-3" /> Phone Number
              </label>
              <input
                type="tel"
                placeholder="+91 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1.5 w-full bg-secondary rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/40 transition-all text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                <Clock className="w-3 h-3" /> Table / Seat Number (optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Table 4"
                value={table}
                onChange={(e) => setTable(e.target.value)}
                className="mt-1.5 w-full bg-secondary rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/40 transition-all text-sm"
              />
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div className="bg-card rounded-3xl border border-border/40 shadow-sm p-5">
          <h3 className="font-bold text-foreground text-base mb-4">
            Order Summary ({cart.length} item{cart.length !== 1 ? "s" : ""})
          </h3>
          <div className="space-y-2">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-foreground">
                  {item.name}{" "}
                  <span className="text-muted-foreground">× {item.quantity}</span>
                </span>
                <span className="font-semibold text-foreground">
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bill summary */}
        <CartSummary />

        {/* Payment method note */}
        <div className="bg-card rounded-3xl border border-border/40 shadow-sm p-5">
          <h3 className="font-bold text-foreground text-base mb-3">
            Payment Method
          </h3>
          <div className="flex items-center gap-3 bg-primary/5 border border-primary/20 rounded-2xl px-4 py-3">
            <span className="text-2xl">💵</span>
            <div>
              <p className="font-semibold text-foreground text-sm">
                Pay at Counter
              </p>
              <p className="text-xs text-muted-foreground">
                Cash or card payment when you pick up your order
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Place Order button */}
      <div className="fixed bottom-0 inset-x-0 max-w-3xl mx-auto px-4 pb-8 pt-4 bg-background/95 backdrop-blur-xl border-t border-border/50">
        <button
          onClick={handlePlaceOrder}
          disabled={!name.trim() || !phone.trim()}
          className="w-full bg-gradient-to-r from-primary to-orange-400 text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/25 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-between px-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="font-medium">Place Order</span>
          <span className="font-extrabold text-lg">₹{grandTotal}</span>
        </button>
      </div>
    </div>
  );
}
