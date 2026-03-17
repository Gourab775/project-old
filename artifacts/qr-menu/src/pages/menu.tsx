import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { RefreshCw } from "lucide-react";
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
  const { categories, menuItems, loading, error, refetch, lastFetchedAt } =
    useMenu();
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const observerRef = useRef<IntersectionObserver | null>(null);
  const intersectingIds = useRef<Set<string>>(new Set());
  const isProgrammaticScroll = useRef(false);

  // Set initial active category when data arrives
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].id);
    }
  }, [categories, activeCategory]);

  // Filter + group — memoised to keep observer dependency stable
  const groupedItems = useMemo(
    () =>
      categories
        .map((category) => {
          let items = menuItems.filter((i) => i.categoryId === category.id);
          if (vegMode) items = items.filter((i) => i.isVeg);
          if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            items = items.filter(
              (i) =>
                i.name.toLowerCase().includes(q) ||
                i.description.toLowerCase().includes(q)
            );
          }
          return { category, items };
        })
        .filter((g) => g.items.length > 0),
    [categories, menuItems, vegMode, searchQuery]
  );

  // IntersectionObserver scroll-spy — picks the topmost visible section
  useEffect(() => {
    if (categories.length === 0) return;

    observerRef.current?.disconnect();
    intersectingIds.current.clear();

    const observer = new IntersectionObserver(
      (entries) => {
        if (isProgrammaticScroll.current) return;

        for (const entry of entries) {
          const id = entry.target.getAttribute("data-category-id");
          if (!id) continue;
          if (entry.isIntersecting) {
            intersectingIds.current.add(id);
          } else {
            intersectingIds.current.delete(id);
          }
        }

        let topmostId: string | null = null;
        let topmostY = Infinity;

        for (const id of intersectingIds.current) {
          const el = sectionRefs.current[id];
          if (!el) continue;
          const top = el.getBoundingClientRect().top;
          if (top < topmostY) {
            topmostY = top;
            topmostId = id;
          }
        }

        if (topmostId) setActiveCategory(topmostId);
      },
      {
        rootMargin: "-120px 0px -55% 0px",
        threshold: 0,
      }
    );

    observerRef.current = observer;
    for (const el of Object.values(sectionRefs.current)) {
      if (el) observer.observe(el);
    }

    return () => {
      observer.disconnect();
      intersectingIds.current.clear();
    };
  }, [categories, groupedItems.length]);

  // Category pill click — scroll section to sit below the sticky bars
  const handleCategoryClick = useCallback((id: string) => {
    setActiveCategory(id);

    const element = document.getElementById(`category-${id}`);
    if (!element) return;

    isProgrammaticScroll.current = true;
    const offset = Math.max(160, Math.round(window.innerHeight * 0.28));
    const top =
      element.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top, behavior: "smooth" });

    setTimeout(() => {
      isProgrammaticScroll.current = false;
    }, 850);
  }, []);

  // Manual refresh — shows a brief spinning icon, then clears cache + fetches
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    refetch();
    setTimeout(() => setIsRefreshing(false), 1500);
  }, [refetch]);

  // Human-readable "last updated" label
  const lastUpdatedLabel = useMemo(() => {
    if (!lastFetchedAt) return null;
    const diff = Math.round((Date.now() - new Date(lastFetchedAt).getTime()) / 1000);
    if (diff < 10) return "just now";
    if (diff < 60) return `${diff}s ago`;
    const mins = Math.round(diff / 60);
    return `${mins}m ago`;
  }, [lastFetchedAt]);

  return (
    <div className="min-h-screen bg-background pb-32">
      <Header />

      {/* Demo-data banner */}
      {!isSupabaseConfigured && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-800 text-xs text-center py-2 px-4">
          Running with demo data — add{" "}
          <code className="font-mono">VITE_SUPABASE_URL</code> &amp;{" "}
          <code className="font-mono">VITE_SUPABASE_ANON_KEY</code> to connect
          Supabase.
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
              <div
                key={n}
                className="h-32 rounded-3xl bg-muted animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Error state with retry */}
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
              onClick={handleRefresh}
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity"
            >
              Try again
            </button>
          </div>
        )}

        {/* Menu sections */}
        {!loading && !error && groupedItems.length > 0 && (
          <>
            {/* Refresh row — shows when data has been fetched at least once */}
            {lastFetchedAt && (
              <div className="flex items-center justify-between mb-6 text-xs text-muted-foreground">
                <span>
                  {lastUpdatedLabel
                    ? `Updated ${lastUpdatedLabel}`
                    : "Menu loaded"}
                </span>
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="flex items-center gap-1.5 text-primary font-semibold hover:opacity-80 transition-opacity disabled:opacity-50"
                  aria-label="Refresh menu"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`}
                  />
                  {isRefreshing ? "Refreshing…" : "Refresh"}
                </button>
              </div>
            )}

            <div className="space-y-10">
              {groupedItems.map(({ category, items }) => (
                <section
                  key={category.id}
                  id={`category-${category.id}`}
                  data-category-id={category.id}
                  ref={(el) => (sectionRefs.current[category.id] = el)}
                  className="scroll-mt-[160px]"
                >
                  {/* Section heading */}
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
          </>
        )}

        {/* Empty / no-results state */}
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
