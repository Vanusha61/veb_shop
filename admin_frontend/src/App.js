import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ProductsPage from './pages/ProductsPage';
import OrdersPage from './pages/OrdersPage';
import 'bootstrap/dist/css/bootstrap.min.css';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('admin_token');
  return token ? children : <Navigate to="/admin/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin/products" element={<PrivateRoute><ProductsPage /></PrivateRoute>} />
        <Route path="/admin/orders" element={<PrivateRoute><OrdersPage /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/admin/products" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;