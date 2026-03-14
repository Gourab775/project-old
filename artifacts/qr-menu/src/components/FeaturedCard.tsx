import { Heart } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export function FeaturedCard() {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="px-4 py-6 max-w-3xl mx-auto">
      <h2 className="font-display text-xl font-bold mb-4 text-foreground">Only For You...</h2>
      
      <div className="relative w-full h-48 rounded-3xl overflow-hidden shadow-xl shadow-primary/10 group cursor-pointer">
        {/* Background Image */}
        {/* landing page hero scenic warm food platter */}
        <img 
          src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=800&h=400" 
          alt="Featured special dish" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Top Right Heart Icon */}
        <button 
          onClick={(e) => { e.stopPropagation(); setIsFavorite(!isFavorite); }}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/20 backdrop-blur-md border border-white/20 hover:bg-black/40 transition-colors"
        >
          <motion.div whileTap={{ scale: 0.8 }}>
            <Heart className={`w-5 h-5 transition-colors ${isFavorite ? 'fill-primary text-primary' : 'text-white'}`} />
          </motion.div>
        </button>

        {/* Text Overlay */}
        <div className="absolute bottom-0 left-0 p-5">
          <div className="inline-flex items-center px-2 py-1 rounded-md bg-primary/90 text-primary-foreground text-xs font-bold uppercase tracking-wider mb-2">
            Chef's Special
          </div>
          <h3 className="text-white font-display text-2xl font-bold leading-tight drop-shadow-md">
            Smoked Ribs Platter
          </h3>
          <p className="text-white/80 text-sm mt-1 drop-shadow-sm">Curated exclusively for you</p>
        </div>
      </div>
    </div>
  );
}
