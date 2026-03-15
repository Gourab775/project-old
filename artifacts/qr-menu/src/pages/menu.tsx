import { useEffect, useState, useRef } from "react";
import { Header } from "../components/Header";
import { SearchBar } from "../components/SearchBar";
import { CategorySlider } from "../components/CategorySlider";
import { FeaturedCard } from "../components/FeaturedCard";
import { MenuItemCard } from "../components/MenuItemCard";
import { CartDrawer } from "../components/CartDrawer";
import { useCart } from "../context/CartContext";
import { getCategories, getMenuItems, type Category, type MenuItem } from "../services/menuService";
import { isSupabaseConfigured } from "../../lib/supabase";

export function MenuPage() {
  const { vegMode, searchQuery } = useCart();
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("");

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [cats, items] = await Promise.all([getCategories(), getMenuItems()]);
      setCategories(cats);
      setMenuItems(items);
      if (cats.length > 0) setActiveCategory(cats[0].id);
      setLoading(false);
    }
    loadData();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      let currentActive = categories[0]?.id ?? "";
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

      if (currentActive !== activeCategory) {
        setActiveCategory(currentActive);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeCategory, categories]);

  const groupedItems = categories
    .map((category) => {
      let items = menuItems.filter((item) => item.categoryId === category.id);
      if (vegMode) items = items.filter((item) => item.isVeg);
      if (searchQuery.trim() !== "") {
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

      {!isSupabaseConfigured && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-800 text-xs text-center py-2 px-4">
          Running with demo data — connect Supabase by adding{" "}
          <code className="font-mono">VITE_SUPABASE_URL</code> &amp;{" "}
          <code className="font-mono">VITE_SUPABASE_ANON_KEY</code> to your
          environment.
        </div>
      )}

      <SearchBar />

      {!searchQuery && !loading && (
        <>
          <CategorySlider categories={categories} activeCategory={activeCategory} />
          <div className="mt-4">
            <FeaturedCard />
          </div>
        </>
      )}

      <main className="max-w-3xl mx-auto px-4 mt-8">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="h-32 rounded-3xl bg-muted animate-pulse"
              />
            ))}
          </div>
        ) : groupedItems.length > 0 ? (
          <div className="space-y-12">
            {groupedItems.map((group) => (
              <section
                key={group.category.id}
                id={`category-${group.category.id}`}
                ref={(el) =>
                  (sectionRefs.current[group.category.id] = el)
                }
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
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <span className="text-4xl">🍽️</span>
            </div>
            <h3 className="text-xl font-bold text-foreground">No dishes found</h3>
            <p className="text-muted-foreground mt-2">
              Try changing your search or{" "}
              {vegMode ? "turn off Veg Mode" : "try a different category"}.
            </p>
          </div>
        )}
      </main>

      <CartDrawer />
    </div>
  );
}
