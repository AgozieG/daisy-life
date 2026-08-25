import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { useUser } from '../hooks/useUser';

const NIGERIAN_STATES = [
  'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno','Cross River','Delta',
  'Ebonyi','Edo','Ekiti','Enugu','FCT (Abuja)','Gombe','Imo','Jigawa','Kaduna','Kano','Katsina',
  'Kebbi','Kogi','Kwara','Lagos','Nasarawa','Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers',
  'Sokoto','Taraba','Yobe','Zamfara',
];

export default function StateModal() {
  const { showStateModal, updateState } = useUser();
  const [selected, setSelected] = useState('Enugu');

  return (
    <AnimatePresence>
      {showStateModal && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="bg-charcoal-light border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl"
          >
            <div className="w-12 h-12 rounded-full bg-daisy-gold/20 flex items-center justify-center mb-4">
              <MapPin className="text-daisy-gold" size={22} />
            </div>
            <h2 className="font-display text-2xl font-bold text-white mb-1">Where are you ordering from?</h2>
            <p className="text-white/60 text-sm mb-4 font-body">This helps us confirm delivery to your area.</p>
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="w-full bg-charcoal border border-white/15 rounded-xl px-4 py-3 text-white font-body focus:outline-none focus:ring-2 focus:ring-daisy-gold"
            >
              {NIGERIAN_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <button
              onClick={() => updateState(selected)}
              className="mt-4 w-full bg-daisy-gold text-charcoal font-accent font-bold py-3 rounded-full hover:brightness-105 active:scale-95 transition-all"
            >
              Confirm State
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
