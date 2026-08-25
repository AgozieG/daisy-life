# 🌼 Daisy Life — Full-Stack Fast Food Ordering App

A complete React + Node.js/Express web app for **Daisy Life**, a fast food restaurant in
New Haven, Enugu, Nigeria. Order shawarma, burgers, pizza, small chops, and more, pay with
Paystack, and the kitchen gets an automated email order receipt.

---

## 📁 Project Structure

```
daisy-life/
├── frontend/     React + Vite + Tailwind CSS (JavaScript)
└── backend/      Node.js + Express (payment verification + email dispatch)
```

## 🚀 Quick Start

### 1. Backend

```bash
cd backend
cp .env.example .env       # then fill in your real keys (see setup guide below)
npm install
npm run dev                 # runs on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env       # then fill in your real keys
npm install
npm run dev                 # runs on http://localhost:5173
```

Set `VITE_API_URL` in `frontend/.env` to the backend URL you want the browser to call.
For local development, leave it as `http://localhost:5000` (or keep the default from
`.env.example`). In production, set it to your deployed backend URL, e.g.
`https://your-backend.onrender.com`.

Open **http://localhost:5173** — the Vite dev server proxies `/api/*` requests to the
backend automatically (see `frontend/vite.config.js`).

---

## 🔑 Setting Up Third-Party Services

### A. Paystack (payments)

1. Sign up free at **https://dashboard.paystack.com**
2. Complete business verification with your Nigerian business details
3. Go to **Settings → API Keys & Webhooks**
4. Copy the **Public Key** (`pk_test_...` or `pk_live_...`) into `frontend/.env` as
   `VITE_PAYSTACK_PUBLIC_KEY`
5. Copy the **Secret Key** (`sk_test_...` or `sk_live_...`) into `backend/.env` as
   `PAYSTACK_SECRET_KEY` — **never put this in the frontend**
6. For testing, use Paystack's test card: `4084 0840 8408 4081`, any future expiry,
   CVV `408`, PIN `0000`

### B. Gmail SMTP (order receipts to the kitchen)

1. Sign in to the Gmail account you want to send from (`georgeiwunna@gmail.com`)
2. Turn on **2-Step Verification** in your Google account
3. Go to **Google Account → Security → App passwords** and create a new 16-character app password
4. Copy the generated password into `backend/.env` as `SMTP_PASS`
5. Set `SMTP_USER=georgeiwunna@gmail.com` and `EMAIL_TO=agozie@gmail.com`
6. Leave `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=587`, and `SMTP_SECURE=false`
7. This sends directly via Gmail SMTP without a third-party email service or Twilio

> Gmail blocks sign-in with a normal account password for SMTP; the app password is required for this setup.

---

## ✅ What's Implemented

- Email sign-up/login, session persisted in `localStorage`
- State selection on first sign-up
- 8 menu categories, 59 products, all real Daisy Life pricing
- Product customisation: sizes, flavours, toppings, drinks — all optional except size
  where the product requires it (e.g. Large-only pizza)
- "Create Your Plate" builder for Pizza, Loaded Fries, and Small Chops
- Persistent cart (localStorage) with live price updates, edit-in-place, and removal
- 3-step checkout: Review → Delivery/Pickup details → Paystack payment
- Backend verifies every payment directly with Paystack's API before doing anything else
- Backend checks the paid amount against the cart total (fraud guard)
- Automated email order receipt sent to the restaurant only after verified payment
- Order success page with a simulated live status tracker + WhatsApp contact link
- Fully responsive, mobile-first, with bottom nav on mobile and a rich dark theme
- Framer Motion animations throughout: hero parallax feel, staggered menu cards,
  confetti on add-to-cart, spring cart badge, animated checkout progress, etc.
- Code-split routes (lazy loading) for a fast, lightweight initial load

## 🛠 Tech Stack

React 19 (Vite) · Tailwind CSS v4 · Framer Motion · React Router · Axios ·
Lucide Icons · canvas-confetti · @react-oauth/google · Node.js · Express ·
Paystack REST API · Nodemailer + Gmail SMTP

## 📦 Deploying

- **Render**: deploy the repository root as one Web Service. Use `npm install && npm run build`
  as the build command and `npm start` as the start command. Express serves the built
  frontend and `/api` routes from the same Render URL.
- Add the root `.env` values as Render environment variables. Set `NODE_ENV=production`,
  `FRONTEND_URL` to the exact Render URL, and leave `VITE_API_URL` empty for the combined app.
- Set `VITE_PAYSTACK_PUBLIC_KEY` during the Render build and keep `PAYSTACK_SECRET_KEY` and
  SMTP credentials private. Render supplies `PORT` automatically; do not set it manually.
