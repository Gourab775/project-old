import { useEffect, useState, useRef, useCallback } from "react";
import { Header } from "../components/Header";
import { SearchBar } from "../components/SearchBar";
import { CategorySlider } from "../components/CategorySlider";
import { FeaturedCard } from "../components/FeaturedCard";
import { MenuItemCard } from "../components/MenuItemCard";
import { CartDrawer } from "../components/CartDrawer";
import { useCart } from "../context/CartContext";
import { useMenu } from "../hooks/useMenu";
import { isSupabaseConfigured } from "../../lib/supabase";

// Height of sticky header (64px) + sticky category slider (~88px) + small gap
const SCROLL_OFFSET = 170;

export function MenuPage() {
  const { vegMode, searchQuery } = useCart();
  const { categories, menuItems, loading, error, refetch } = useMenu();
  const [activeCategory, setActiveCategory] = useState<string>("");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const observerRef = useRef<IntersectionObserver | null>(null);
  // Track whether a programmatic scroll is in progress so the observer
  // doesn't immediately override the active category we just set.
  const isProgrammaticScroll = useRef(false);

  // Set initial active category once data loads
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].id);
    }
  }, [categories, activeCategory]);

  // IntersectionObserver scroll-spy
  useEffect(() => {
    if (categories.length === 0) return;

    observerRef.current?.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (isProgrammaticScroll.current) return;

        // Pick the entry that is most visible and in the upper portion of the screen
        let bestEntry: IntersectionObserverEntry | null = null;
        let bestRatio = 0;

        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio;
            bestEntry = entry;
          }
        }

        if (bestEntry) {
          const id = bestEntry.target.getAttribute("data-category-id");
          if (id) setActiveCategory(id);
        }
      },
      {
        // Trigger when a section enters the band between the sticky header area and
        // 50% of the viewport height below it — this gives natural "current section" feel
        rootMargin: `-${SCROLL_OFFSET}px 0px -45% 0px`,
        threshold: [0, 0.1, 0.5, 1],
      }
    );

    for (const el of Object.values(sectionRefs.current)) {
      if (el) observerRef.current.observe(el);
    }

    return () => observerRef.current?.disconnect();
  }, [categories, menuItems, vegMode, searchQuery]);

  // Programmatic scroll when user clicks a category pill
  const handleCategoryClick = useCallback((id: string) => {
    setActiveCategory(id);

    const element = document.getElementById(`category-${id}`);
    if (!element) return;

    isProgrammaticScroll.current = true;
    const y = element.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET;
    window.scrollTo({ top: y, behavior: "smooth" });

    // Re-enable observer after scroll animation completes (~700 ms)
    setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 750);
  }, []);

  // Group items by category, applying veg filter and search
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

      {/* Category slider + featured card (hidden during search) */}
      {!searchQuery && !loading && !error && (
        <>
          <CategorySlider
            categories={categories}
            activeCategory={activeCategory}
            onCategoryClick={handleCategoryClick}
          />
          <div className="mt-4 max-w-3xl mx-auto px-4">
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

        {/* Error state */}
        {!loading && error && (
          <div className="py-20 flex flex-col items-center justify-center text-center gap-4">
            <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center">
              <span className="text-3xl">⚠️</span>
            </div>
            <h3 className="text-lg font-bold text-foreground">
              Failed to load menu
            </h3>
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
          <div className="space-y-10">
            {groupedItems.map(({ category, items }) => (
              <section
                key={category.id}
                id={`category-${category.id}`}
                data-category-id={category.id}
                ref={(el) => (sectionRefs.current[category.id] = el)}
                className="scroll-mt-[170px]"
              >
                {/* Section header */}
                <div className="flex items-center gap-3 mb-5">
                  <h2 className="font-display text-xl font-bold text-foreground whitespace-nowrap">
                    {category.name}
                  </h2>
                  <div className="h-px flex-1 bg-border/50" />
                  <span className="text-xs text-muted-foreground font-medium shrink-0">
                    {items.length} item{items.length !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {items.map((item) => (
                    <MenuItemCard key={item.id} item={item} />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}

        {/* Empty / no results state */}
        {!loading && !error && groupedItems.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">🍽️</span>
            </div>
            <h3 className="text-xl font-bold text-foreground">
              No dishes found
            </h3>
            <p className="text-muted-foreground mt-2 max-w-xs">
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
