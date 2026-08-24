import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, Star, Clock, Heart } from 'lucide-react';
import menuData from '../data/menu.json';

const REVIEWS = [
  { name: 'Favour', text: 'The first time I came to Daisy, I ordered their shawarma — it took 10 minutes max and it was ready.' },
  { name: 'Nkeiruka Ijeh', text: 'My experience at Daisy Life was awesome. Neat, calm, welcoming. Food is fresh, well prepared, and very tasty.' },
  { name: 'Mercy Nnamani', text: 'Daisy Life has to be the best food vendor in Enugu — her meals are so nice and the plating is second to none.' },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div>
      {/* HERO */}
      <section className="relative h-screen min-h-[640px] flex items-center justify-center overflow-hidden">
        <img
          src="hero.jpg"
          alt="Daisy Life food spread"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/70 via-charcoal/60 to-charcoal" />

        <span className="absolute text-5xl top-[18%] left-[10%] animate-float" style={{ animationDelay: '0s' }}>🍔</span>
        <span className="absolute text-5xl top-[28%] right-[12%] animate-float" style={{ animationDelay: '1s' }}>🌯</span>
        <span className="absolute text-5xl bottom-[22%] left-[16%] animate-float" style={{ animationDelay: '2s' }}>🍕</span>

        <div className="relative z-10 text-center px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-charcoal-light/70 backdrop-blur border border-white/10 px-4 py-2 rounded-full mb-5"
          >
            <Star size={14} className="text-daisy-gold fill-daisy-gold" />
            <span className="text-white text-sm font-body">4.4 on Google · 27 Reviews</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display font-black text-4xl sm:text-6xl md:text-7xl text-daisy-gold leading-tight mb-4"
          >
            Life Tastes Better<br />at Daisy
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/90 font-body text-base sm:text-lg mb-8"
          >
            Enugu's boldest fast food — order in 60 seconds.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <button
              onClick={() => navigate('/menu')}
              className="bg-daisy-gold text-charcoal font-accent font-bold px-8 py-3.5 rounded-full hover:brightness-105 active:scale-95 transition-all animate-pulse-glow"
            >
              Order Now →
            </button>
            <a
              href="#categories"
              className="border border-white/30 text-white font-accent font-semibold px-8 py-3.5 rounded-full hover:bg-white/10 transition-colors"
            >
              See Our Menu
            </a>
          </motion.div>
        </div>

        <ChevronDown className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60 animate-bounce" size={28} />
      </section>

      {/* MARQUEE */}
      <div className="bg-daisy-gold overflow-hidden py-2.5 whitespace-nowrap">
        <div className="inline-block animate-marquee font-accent font-bold text-charcoal text-sm">
          {Array(2).fill('🔥 NEW: Sausage Crust Pizza  ·  📍 New Haven, Enugu  ·  🕐 Open 8AM–10PM Daily  ·  🌼 Daisy Life  ·  ').join('')}
        </div>
      </div>

      {/* WHY DAISY */}
      <section className="py-16 px-4 sm:px-6 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { icon: Star, label: '4.4 Google Rating', color: 'text-daisy-gold' },
          { icon: Clock, label: 'Ready in under 10 mins', color: 'text-forest-green' },
          { icon: Heart, label: 'Women-Owned, Enugu-Proud', color: 'text-deep-red' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="bg-charcoal-light border border-white/5 rounded-2xl p-6 text-center"
          >
            <s.icon className={`mx-auto mb-3 ${s.color}`} size={30} />
            <p className="font-accent font-bold text-white">{s.label}</p>
          </motion.div>
        ))}
      </section>

      {/* CATEGORY GRID */}
      <section id="categories" className="py-10 px-4 sm:px-6 max-w-6xl mx-auto">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-8 text-center">Explore Our Menu</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {menuData.categories.map((cat, i) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              whileHover={{ scale: 1.04 }}
              onClick={() => navigate(`/menu?category=${cat.id}`)}
              className="relative h-32 sm:h-40 rounded-2xl overflow-hidden group text-left"
              style={{ boxShadow: `0 0 0 1px ${cat.accentColour}33` }}
            >
              <img src={cat.products[0]?.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent" />
              <div className="absolute bottom-0 p-3">
                <span className="text-2xl">{cat.emoji}</span>
                <p className="font-accent font-bold text-white text-sm">{cat.name}</p>
                <p className="text-white/60 text-xs">{cat.products.length} items</p>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-16 px-4 sm:px-6 max-w-5xl mx-auto">
        <h2 className="font-display text-3xl font-bold text-white mb-8 text-center">What Enugu Is Saying</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {REVIEWS.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-charcoal-light border border-white/5 rounded-2xl p-5"
            >
              <div className="flex gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, s) => <Star key={s} size={14} className="text-daisy-gold fill-daisy-gold" />)}
              </div>
              <p className="text-white/70 text-sm font-body mb-4 italic">"{r.text}"</p>
              <p className="font-accent font-semibold text-daisy-gold text-sm">{r.name}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
