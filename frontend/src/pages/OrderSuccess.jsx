import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { CheckCircle2, Copy, MessageCircle } from 'lucide-react';
import { useToast } from '../hooks/useToast';

const STAGES = ['Order Received', 'Preparing Your Order', 'Out for Delivery / Ready', 'Delivered / Collected'];

export default function OrderSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    if (!state?.orderId) { navigate('/'); return; }
    confetti({ particleCount: 120, spread: 90, origin: { y: 0.4 }, colors: ['#F5C518', '#C0392B', '#1A7A4A', '#FF6B35'] });
    const t1 = setTimeout(() => setStageIndex(1), 8000);
    const t2 = setTimeout(() => setStageIndex(2), 20000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!state?.orderId) return null;

  const copyId = () => {
    navigator.clipboard.writeText(state.orderId);
    showToast('Order ID copied', 'success');
  };

  return (
    <div className="pt-28 pb-16 px-4 sm:px-6 max-w-lg mx-auto min-h-screen flex flex-col items-center text-center">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 18 }}>
        <CheckCircle2 size={72} className="text-forest-green" />
      </motion.div>
      <h1 className="font-display text-3xl sm:text-4xl font-bold text-white mt-5 mb-2">Order Placed! 🎉</h1>
      <p className="text-white/60 font-body mb-6">Your receipt has been sent to Daisy Life's kitchen team.</p>

      <button onClick={copyId} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white/80 text-sm font-body mb-8">
        Order ID: <span className="text-daisy-gold font-accent">{state.orderId}</span> <Copy size={13} />
      </button>

      <div className="w-full bg-charcoal-light rounded-2xl p-5 mb-8 text-left">
        <h3 className="font-accent font-bold text-white mb-4">Order Status</h3>
        <div className="space-y-4">
          {STAGES.map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${i <= stageIndex ? 'bg-daisy-gold' : 'bg-white/10'}`}>
                {i < stageIndex ? <CheckCircle2 size={14} className="text-charcoal" /> : i === stageIndex ? (
                  <span className="w-2 h-2 bg-charcoal rounded-full animate-ping" />
                ) : null}
              </div>
              <span className={`text-sm font-body ${i <= stageIndex ? 'text-white' : 'text-white/40'}`}>{s}</span>
            </div>
          ))}
        </div>
        <p className="text-white/40 text-xs font-body mt-4">
          Estimated time: {state.deliveryType === 'delivery' ? '30–45 mins' : '15–20 mins'}
        </p>
      </div>

      <div className="w-full flex flex-col gap-3">
        <a
          href={`https://wa.me/2349130730895?text=${encodeURIComponent(`Hi Daisy Life, checking on my order ${state.orderId}`)}`}
          target="_blank" rel="noreferrer"
          className="w-full bg-forest-green text-white font-accent font-bold py-3 rounded-full flex items-center justify-center gap-2"
        >
          <MessageCircle size={16} /> WhatsApp Us
        </a>
        <button onClick={() => navigate('/menu')} className="w-full bg-daisy-gold text-charcoal font-accent font-bold py-3 rounded-full">
          Order Again
        </button>
        <button onClick={() => navigate('/')} className="text-white/50 text-sm font-body underline underline-offset-2">
          Back to Home
        </button>
      </div>
    </div>
  );
}
