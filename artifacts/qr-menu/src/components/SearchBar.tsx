import { Search } from "lucide-react";
import { useCart } from "../context/CartContext";

export function SearchBar() {
  const { searchQuery, setSearchQuery, vegMode, setVegMode } = useCart();

  return (
    <div className="px-4 py-4 max-w-3xl mx-auto flex items-center gap-3">
      <div className="relative flex-1 group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search dishes, cuisines..."
          className="w-full h-12 pl-11 pr-4 bg-white border border-border/60 rounded-2xl text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-300"
        />
      </div>

      {/* Veg Mode Toggle */}
      <button 
        onClick={() => setVegMode(!vegMode)}
        className={`relative flex items-center gap-2 h-12 px-4 rounded-2xl border transition-all duration-300 ${
          vegMode 
            ? "bg-green-50 border-green-200 shadow-inner" 
            : "bg-white border-border/60 shadow-sm hover:border-border"
        }`}
      >
        <div className="flex flex-col items-start justify-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Mode</span>
          <span className={`text-sm font-semibold leading-none ${vegMode ? "text-green-700" : "text-foreground"}`}>
            Veg
          </span>
        </div>
        <div className={`w-10 h-6 rounded-full p-1 transition-colors duration-300 ${vegMode ? 'bg-green-500' : 'bg-muted-foreground/30'}`}>
          <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${vegMode ? 'translate-x-4' : 'translate-x-0'}`} />
        </div>
      </button>
    </div>
  );
}
