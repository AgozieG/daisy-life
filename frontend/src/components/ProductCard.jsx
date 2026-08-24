import { motion } from 'framer-motion';
import { formatCurrency } from '../utils/formatCurrency';

export default function ProductCard({ product, onSelect, index = 0 }) {
  const priceLabel = product.hasVariants && product.variants.length > 1
    ? `${formatCurrency(product.basePrice)} – ${formatCurrency(product.basePrice + Math.max(...product.variants.map(v => v.priceModifier)))}`
    : formatCurrency(product.basePrice);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.4) }}
      whileHover={{ y: -6 }}
      className="group rounded-2xl overflow-hidden bg-charcoal-light border border-white/5 hover:border-daisy-gold/40 shadow-lg hover:shadow-2xl transition-colors flex flex-col"
    >
      <div className="relative h-40 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <span className="absolute top-2 left-2 bg-charcoal/80 backdrop-blur text-daisy-gold text-[10px] font-accent font-bold px-2 py-1 rounded-full">
          {product.categoryEmoji}
        </span>
        {product.badges?.[0] && (
          <span className="absolute top-2 right-2 bg-hot-orange text-white text-[10px] font-accent font-bold px-2 py-1 rounded-full">
            {product.badges[0]}
          </span>
        )}
      </div>
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        <h3 className="font-body font-semibold text-white text-[17px] sm:text-[19px] leading-tight mb-2">{product.name}</h3>
        <p className="text-white/60 text-sm sm:text-[15px] font-body mb-3 line-clamp-2 flex-1">{product.tagline}</p>
        <div className="flex items-center justify-between mb-3">
          <span className="font-accent font-bold text-daisy-gold text-xl sm:text-[1.35rem]">{priceLabel}</span>
        </div>
        <button
          onClick={() => onSelect(product)}
          className="w-full bg-deep-red hover:bg-deep-red/90 text-white font-accent font-semibold text-sm sm:text-base py-3 rounded-full active:scale-95 transition-all"
        >
          Customise & Add
        </button>
      </div>
    </motion.div>
  );
}
