import { MapPin, Phone, Mail, Sparkles, MessageCircle } from 'lucide-react';

function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={16} height={16} {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}
function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width={16} height={16} {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-charcoal border-t border-white/10 pt-14 pb-28 md:pb-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="font-fun text-daisy-gold text-2xl mb-2"><span className="inline-block animate-[spin_6s_linear_infinite]">🌼</span> Daisy Life</div>
          <p className="text-white/60 text-sm font-body mb-4">Life tastes better at Daisy — Enugu's boldest fast food.</p>
          <div className="flex gap-3">
            <a href="https://www.instagram.com/daisylifeng/" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-daisy-gold hover:text-charcoal transition-colors">
              <InstagramIcon />
            </a>
            <a href="https://www.facebook.com/daisylifeng/" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-daisy-gold hover:text-charcoal transition-colors">
              <FacebookIcon />
            </a>
            <a href="https://wa.me/2348107162867?text=Hello%20Daisy%20Life" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-daisy-gold hover:text-charcoal transition-colors" aria-label="Chat on WhatsApp">
              <MessageCircle size={16} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-accent font-bold text-white mb-3 text-sm uppercase tracking-wide">Menu</h4>
          <ul className="space-y-2 text-white/60 text-sm font-body">
            <li>Small Chops</li><li>Pasta & Rice</li><li>Pizza</li><li>Dine With Me Boxes</li>
            <li>Loaded Fries</li><li>Shawarma</li><li>Burger</li><li>Drinks</li>
          </ul>
        </div>

        <div>
          <h4 className="font-accent font-bold text-white mb-3 text-sm uppercase tracking-wide">Contact</h4>
          <ul className="space-y-3 text-white/60 text-sm font-body">
            <li className="flex gap-2"><MapPin size={16} className="shrink-0 mt-0.5 text-daisy-gold" /> Sabbath Bus Stop, 7 Umueke St, New Haven, Enugu 400102</li>
            <li className="flex gap-2"><Phone size={16} className="shrink-0 mt-0.5 text-daisy-gold" /> 0810 716 2867</li>
          </ul>
          <a
            href="https://www.google.com/maps/place/Daisy+Life/@6.4562058,7.5269143,17z"
            target="_blank" rel="noreferrer"
            className="inline-block mt-3 text-daisy-gold text-sm underline underline-offset-2"
          >
            Open in Google Maps →
          </a>
        </div>

        <div>
          <h4 className="font-accent font-bold text-white mb-3 text-sm uppercase tracking-wide">Hours</h4>
          <ul className="space-y-1 text-white/60 text-sm font-body">
            <li>Mon – Sun: 8:00 AM – 10:00 PM</li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto border-t border-white/10 mt-10 pt-6">
        <div className="flex flex-wrap items-center justify-center gap-2.5 text-center text-white/80 font-accent font-semibold text-xs sm:text-sm md:text-base">
          <span className="inline-flex items-center gap-2 rounded-full border border-daisy-gold/40 bg-white/5 px-3 py-1.5 shadow-[0_0_18px_rgba(245,197,24,0.12)]">
            <Sparkles size={14} className="text-daisy-gold" />
            Designed and Developed by
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
            <Phone size={14} className="text-daisy-gold" />
            09130730895
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
            <Mail size={14} className="text-daisy-gold" />
            webdevdes989@gmail.com
          </span>
        </div>
      </div>
    </footer>
  );
}
