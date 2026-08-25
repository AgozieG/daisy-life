import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import menuData from '../data/menu.json';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import LoadingSkeleton from '../components/LoadingSkeleton';

export default function Menu() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCat = searchParams.get('category') || menuData.categories[0].id;
  const [activeCategory, setActiveCategory] = useState(initialCat);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 350);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setActiveCategory(cat);
  }, [searchParams]);

  const category = menuData.categories.find((c) => c.id === activeCategory) || menuData.categories[0];

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return category.products;
    const q = query.toLowerCase();
    return category.products.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }, [category, query]);

  return (
    <div className="pt-24 pb-24 md:pb-16 px-4 sm:px-6 max-w-7xl mx-auto min-h-screen">
      <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-6">Our Menu</h1>

      <div className="sticky top-16 z-30 bg-charcoal/95 backdrop-blur-lg -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 mb-6">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3">
          {menuData.categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.id); setSearchParams({ category: cat.id }); setQuery(''); }}
              className={`shrink-0 px-5 py-2.5 rounded-full text-base font-body font-medium whitespace-nowrap transition-all ${
                activeCategory === cat.id ? 'bg-daisy-gold text-charcoal font-bold' : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {cat.emoji} {cat.name}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${category.name}...`}
            className="w-full bg-white/5 border border-white/10 rounded-full pl-11 pr-4 py-3 text-white text-base font-body placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-daisy-gold"
          />
        </div>
      </div>

      <p className="text-white/50 text-base font-body mb-4">
        {loading ? 'Loading...' : `Showing ${filteredProducts.length} result${filteredProducts.length !== 1 ? 's' : ''} in ${category.name}`}
      </p>

      {loading ? (
        <LoadingSkeleton />
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-5xl mb-4">🤔</p>
          <p className="text-white/60 font-body">Hmm, we couldn't find that. Try a different search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.map((product, i) => (
            <ProductCard
              key={product.id}
              product={{ ...product, categoryEmoji: category.emoji }}
              index={i}
              onSelect={setSelected}
            />
          ))}
        </div>
      )}

      {selected && <ProductModal product={selected} category={category} onClose={() => setSelected(null)} />}
    </div>
  );
}
