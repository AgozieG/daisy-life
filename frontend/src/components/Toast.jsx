import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, XCircle, Info, AlertTriangle } from 'lucide-react';
import { useToast } from '../hooks/useToast';

const ICONS = { success: CheckCircle2, error: XCircle, info: Info, warning: AlertTriangle };
const STYLES = {
  success: 'bg-forest-green border-forest-green/50',
  error: 'bg-deep-red border-deep-red/50',
  info: 'bg-charcoal-light border-daisy-gold/40',
  warning: 'bg-hot-orange border-hot-orange/50',
};

export default function ToastContainer() {
  const { toasts } = useToast();
  return (
    <div className="fixed top-4 right-4 left-4 sm:left-auto z-[100] flex flex-col gap-2 items-center sm:items-end">
      <AnimatePresence>
        {toasts.map((t) => {
          const Icon = ICONS[t.type] || Info;
          return (
            <motion.div
              key={t.id}
              initial={{ x: 80, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 80, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-white shadow-xl font-body text-sm max-w-xs ${STYLES[t.type] || STYLES.info}`}
              role="status"
            >
              <Icon size={18} className="shrink-0" />
              <span>{t.message}</span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
