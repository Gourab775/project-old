import { categories } from "../data/menuData";
import { motion } from "framer-motion";

export function CategoryCarousel({ activeCategory }: { activeCategory: string }) {
  
  const scrollToCategory = (id: string) => {
    const element = document.getElementById(`category-${id}`);
    if (element) {
      // Offset for sticky header (64px) + some padding
      const y = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full overflow-x-auto hide-scrollbar py-2 border-b border-border/30 bg-background/50 backdrop-blur-sm sticky top-16 z-40">
      <div className="flex gap-4 px-4 w-max max-w-3xl mx-auto">
        {categories.map((category) => {
          const isActive = activeCategory === category.id;
          return (
            <button
              key={category.id}
              onClick={() => scrollToCategory(category.id)}
              className="flex flex-col items-center gap-2 group"
            >
              <div className={`relative p-1 rounded-full transition-all duration-300 ${isActive ? 'bg-primary' : 'bg-transparent group-hover:bg-primary/20'}`}>
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-background bg-secondary">
                  <img 
                    src={category.imageUrl} 
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                {isActive && (
                  <motion.div layoutId="activeCategory" className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </div>
              <span className={`text-xs font-medium transition-colors ${isActive ? 'text-primary font-bold' : 'text-muted-foreground group-hover:text-foreground'}`}>
                {category.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
