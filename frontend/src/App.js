import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <div className="container mt-3">
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-success/:id" element={<OrderSuccessPage />} />
          </Routes>
        </div>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;