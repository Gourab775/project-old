import { useEffect, useState, useRef } from "react";
import { Header } from "../components/Header";
import { SearchBar } from "../components/SearchBar";
import { CategorySlider } from "../components/CategorySlider";
import { FeaturedCard } from "../components/FeaturedCard";
import { MenuItemCard } from "../components/MenuItemCard";
import { CartDrawer } from "../components/CartDrawer";
import { useCart } from "../context/CartContext";
import { useMenu } from "../hooks/useMenu";
import { isSupabaseConfigured } from "../../lib/supabase";

export function MenuPage() {
  const { vegMode, searchQuery } = useCart();
  const { categories, menuItems, loading, error, refetch } = useMenu();
  const [activeCategory, setActiveCategory] = useState<string>("");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  // Set initial active category once categories load
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].id);
    }
  }, [categories, activeCategory]);

  // Scroll-spy: update active category as user scrolls
  useEffect(() => {
    const handleScroll = () => {
      if (categories.length === 0) return;
      let currentActive = categories[0].id;
      let minDistance = Infinity;
      const scrollY = window.scrollY + 180;

      categories.forEach((category) => {
        const el = sectionRefs.current[category.id];
        if (el) {
          const distance = Math.abs(el.offsetTop - scrollY);
          if (distance < minDistance && el.offsetTop <= scrollY + 100) {
            minDistance = distance;
            currentActive = category.id;
          }
        }
      });

      if (currentActive !== activeCategory) setActiveCategory(currentActive);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeCategory, categories]);

  // Filter and group items by category
  const groupedItems = categories
    .map((category) => {
      let items = menuItems.filter((item) => item.categoryId === category.id);
      if (vegMode) items = items.filter((item) => item.isVeg);
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        items = items.filter(
          (item) =>
            item.name.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q)
        );
      }
      return { category, items };
    })
    .filter((group) => group.items.length > 0);

  return (
    <div className="min-h-screen bg-background pb-32">
      <Header />

      {/* Supabase connection banner */}
      {!isSupabaseConfigured && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-800 text-xs text-center py-2 px-4">
          Running with demo data — add{" "}
          <code className="font-mono">VITE_SUPABASE_URL</code> &amp;{" "}
          <code className="font-mono">VITE_SUPABASE_ANON_KEY</code> to connect Supabase.
        </div>
      )}

      <SearchBar />

      {/* Category slider + featured card hidden during search */}
      {!searchQuery && !loading && !error && (
        <>
          <CategorySlider categories={categories} activeCategory={activeCategory} />
          <div className="mt-4">
            <FeaturedCard />
          </div>
        </>
      )}

      <main className="max-w-3xl mx-auto px-4 mt-8">
        {/* Loading skeletons */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-32 rounded-3xl bg-muted animate-pulse" />
            ))}
          </div>
        )}

        {/* Error state with retry */}
        {!loading && error && (
          <div className="py-20 flex flex-col items-center justify-center text-center gap-4">
            <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center">
              <span className="text-3xl">⚠️</span>
            </div>
            <h3 className="text-lg font-bold text-foreground">Failed to load menu</h3>
            <p className="text-sm text-muted-foreground max-w-xs">{error}</p>
            <button
              onClick={refetch}
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              Try again
            </button>
          </div>
        )}

        {/* Menu grouped by category */}
        {!loading && !error && groupedItems.length > 0 && (
          <div className="space-y-12">
            {groupedItems.map((group) => (
              <section
                key={group.category.id}
                id={`category-${group.category.id}`}
                ref={(el) => (sectionRefs.current[group.category.id] = el)}
                className="scroll-mt-40"
              >
                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                  {group.category.name}
                  <div className="h-px flex-1 bg-border/60" />
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {group.items.map((item) => (
                    <MenuItemCard key={item.id} item={item} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && groupedItems.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">🍽️</span>
            </div>
            <h3 className="text-xl font-bold text-foreground">No dishes found</h3>
            <p className="text-muted-foreground mt-2">
              {vegMode
                ? "No vegetarian items match your search. Try turning off Veg Mode."
                : "Try a different search term."}
            </p>
          </div>
        )}
      </main>

      <CartDrawer />
    </div>
  );
}
