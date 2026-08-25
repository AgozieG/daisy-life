import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useUser } from '../hooks/useUser';
import { useToast } from '../hooks/useToast';

export default function Auth() {
  const [mode, setMode] = useState('signup');
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const { login } = useUser();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email.includes('@')) return showToast('Enter a valid email address', 'error');
    if (form.password.length < 8) return showToast('Password must be at least 8 characters', 'error');
    if (mode === 'signup') {
      if (!form.name.trim()) return showToast('Enter your full name', 'error');
      if (form.password !== form.confirm) return showToast("Passwords don't match", 'error');
    }
    login({ name: form.name || form.email.split('@')[0], email: form.email, picture: null, provider: 'email' });
    showToast(mode === 'signup' ? 'Account created — welcome!' : 'Welcome back!', 'success');
    navigate('/menu');
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex w-1/2 relative overflow-hidden">
        <img src="hero.jpg" alt="Daisy Life food" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/60 to-charcoal/20" />
        <div className="relative z-10 flex flex-col justify-end p-12">
          <span className="text-6xl mb-4 animate-float">🌼</span>
          <h2 className="font-display text-4xl font-bold text-white mb-3">Life Tastes Better at Daisy</h2>
          <p className="text-white/70 font-body">"Meals are so nice and the plating is second to none." — Mercy N.</p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
          <div className="text-center mb-8">
            <span className="text-4xl">🌼</span>
            <h1 className="font-display text-2xl font-bold text-white mt-2">Welcome to Daisy Life</h1>
          </div>

          <div className="flex bg-white/5 rounded-full p-1 mb-6">
            {['signup', 'login'].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2 rounded-full text-sm font-accent font-semibold transition-colors ${
                  mode === m ? 'bg-daisy-gold text-charcoal' : 'text-white/60'
                }`}
              >
                {m === 'signup' ? 'Sign Up' : 'Log In'}
              </button>
            ))}
          </div>

          <div className="mb-5">
            <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-center text-xs text-white/70 font-body">
              Use your email and password to continue.
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'signup' && (
              <Input placeholder="Full Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            )}
            <Input type="email" placeholder="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
            <div className="relative">
              <Input
                type={showPass ? 'text' : 'password'}
                placeholder="Password"
                value={form.password}
                onChange={(v) => setForm({ ...form, password: v })}
              />
              <button type="button" onClick={() => setShowPass((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {mode === 'signup' && (
              <Input type={showPass ? 'text' : 'password'} placeholder="Confirm Password" value={form.confirm} onChange={(v) => setForm({ ...form, confirm: v })} />
            )}

            <button
              type="submit"
              className="w-full bg-daisy-gold text-charcoal font-accent font-bold py-3 rounded-full mt-2 hover:brightness-105 active:scale-95 transition-all"
            >
              {mode === 'signup' ? 'Create Account' : 'Log In'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

function Input({ type = 'text', placeholder, value, onChange }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-body placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-daisy-gold"
    />
  );
}
