import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import BottomNav from './components/BottomNav';
import Footer from './components/Footer';
import Cart from './components/Cart';
import ToastContainer from './components/Toast';

const Home = lazy(() => import('./pages/Home'));
const Menu = lazy(() => import('./pages/Menu'));
const Auth = lazy(() => import('./pages/Auth'));
const Checkout = lazy(() => import('./pages/Checkout'));
const CreateYourPlate = lazy(() => import('./pages/CreateYourPlate'));
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <span className="inline-block text-5xl animate-[spin_6s_linear_infinite] animate-pulse-glow rounded-full">🌼</span>
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  const location = useLocation();
  const hideChrome = location.pathname === '/auth';

  return (
    <div className="min-h-screen bg-charcoal">
      <ScrollToTop />
      {!hideChrome && <Navbar />}
      <main>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/create-your-plate" element={<CreateYourPlate />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success" element={<OrderSuccess />} />
          </Routes>
        </Suspense>
      </main>
      {!hideChrome && <Footer />}
      {!hideChrome && <BottomNav />}
      <Cart />
      <ToastContainer />
    </div>
  );
}
