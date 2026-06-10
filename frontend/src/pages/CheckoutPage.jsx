import React, { useState, useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CheckoutPage = () => {
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    delivery_address: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    let sessionId = localStorage.getItem('session_id');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36);
      localStorage.setItem('session_id', sessionId);
    }

    const orderData = {
      session_id: sessionId,
      items: cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        price_at_time: item.price
      })),
      ...form
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      if (!res.ok) throw new Error('Ошибка при создании заказа');
      const data = await res.json();
      clearCart();
      navigate(`/order-success/${data.order_id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return <div className="container mt-5">Корзина пуста. <a href="/">Вернуться в магазин</a></div>;
  }

  return (
    <div className="container mt-5">
      <h2>Оформление заказа</h2>
      <div className="row">
        <div className="col-md-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Имя</label>
              <input name="customer_name" className="form-control" required onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label>Email</label>
              <input name="customer_email" type="email" className="form-control" required onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label>Телефон</label>
              <input name="customer_phone" className="form-control" required onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label>Адрес доставки</label>
              <textarea name="delivery_address" className="form-control" required onChange={handleChange} />
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Оформляем...' : 'Подтвердить заказ'}
            </button>
          </form>
        </div>
        <div className="col-md-6">
          <h4>Ваш заказ</h4>
          <ul className="list-group">
            {cart.map(item => (
              <li key={item.id} className="list-group-item d-flex justify-content-between">
                {item.name} x{item.quantity}
                <span>{(item.price * item.quantity).toFixed(2)} ₽</span>
              </li>
            ))}
          </ul>
          <h5 className="mt-3">Итого: {totalPrice.toFixed(2)} ₽</h5>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;