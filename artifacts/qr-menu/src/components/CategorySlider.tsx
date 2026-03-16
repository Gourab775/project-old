import { useEffect, useRef, memo } from "react";
import { motion } from "framer-motion";
import type { Category } from "../services/categoryService";

interface CategorySliderProps {
  categories: Category[];
  activeCategory: string;
  onCategoryClick: (id: string) => void;
}

export const CategorySlider = memo(function CategorySlider({
  categories,
  activeCategory,
  onCategoryClick,
}: CategorySliderProps) {
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Whenever activeCategory changes, scroll that button into the centre of the
  // horizontal strip.  block:"nearest" ensures the PAGE does not scroll vertically.
  useEffect(() => {
    const btn = buttonRefs.current[activeCategory];
    if (!btn) return;
    btn.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeCategory]);

  return (
    <div className="w-full bg-background/80 backdrop-blur-sm sticky top-16 z-40 border-b border-border/30 shadow-sm">
      <div
        className="overflow-x-auto hide-scrollbar py-3"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div className="flex gap-3 px-4 w-max mx-auto">
          {categories.map((category) => {
            const isActive = activeCategory === category.id;
            return (
              <button
                key={category.id}
                ref={(el) => (buttonRefs.current[category.id] = el)}
                onClick={() => onCategoryClick(category.id)}
                className="flex flex-col items-center gap-1.5 group focus:outline-none"
              >
                {/* Circle image */}
                <div
                  className={`relative p-[3px] rounded-full transition-all duration-300 ${
                    isActive
                      ? "bg-primary shadow-md shadow-primary/40"
                      : "bg-transparent group-hover:bg-primary/15"
                  }`}
                >
                  <div className="w-[60px] h-[60px] rounded-full overflow-hidden border-2 border-background bg-secondary">
                    <img
                      src={category.imageUrl}
                      alt={category.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          category.name
                        )}&background=f97316&color=fff&size=60&bold=true`;
                      }}
                    />
                  </div>

                  {/* Active dot indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeCategoryDot"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary"
                    />
                  )}
                </div>

                {/* Label */}
                <span
                  className={`text-[11px] font-semibold leading-tight text-center transition-colors max-w-[64px] truncate ${
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-foreground"
                  }`}
                >
                  {category.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
});
