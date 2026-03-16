import { useCart } from "../../context/CartContext";

export function CartSummary() {
  const { totalItems, subtotal, tax, grandTotal } = useCart();

  return (
    <div className="bg-card rounded-3xl border border-border/40 shadow-sm p-5 space-y-3">
      <h3 className="font-bold text-foreground text-lg mb-4">Bill Summary</h3>

      <div className="flex justify-between text-muted-foreground text-sm">
        <span>
          Subtotal ({totalItems} item{totalItems !== 1 ? "s" : ""})
        </span>
        <span>₹{subtotal}</span>
      </div>

      <div className="flex justify-between text-muted-foreground text-sm">
        <span>GST &amp; Taxes (5%)</span>
        <span>₹{tax}</span>
      </div>

      <div className="flex justify-between text-muted-foreground text-sm">
        <span>Delivery fee</span>
        <span className="text-green-600 font-semibold">FREE</span>
      </div>

      <div className="pt-3 border-t border-border/50 flex justify-between font-bold text-foreground text-base">
        <span>Total to pay</span>
        <span className="text-primary text-lg">₹{grandTotal}</span>
      </div>
    </div>
  );
}
