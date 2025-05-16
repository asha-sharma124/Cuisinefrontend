import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import About from './pages/About';
import Service from './pages/Service';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import TrackOrderPage from './pages/TrackOrderPage';
import { CartProvider } from './context/CartContext';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import CategoryPage from './pages/CategoryPage';
import VendorRegister from './pages/VendorRegister';

function App() {
  return (
    <CartProvider>
      <Router>
        <Header />
        <TransitionGroup>
          <CSSTransition
            timeout={300}
            classNames="fade"
            key={window.location.pathname}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/service" element={<Service />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
              <Route path="/track-order" element={<TrackOrderPage />} />
            
              <Route path="/categories" element={<CategoryPage />} />
              <Route path="/vendor" element={<VendorRegister />} />
            </Routes>
          </CSSTransition>
        </TransitionGroup>
      </Router>
    </CartProvider>
  );
}

export default App;
