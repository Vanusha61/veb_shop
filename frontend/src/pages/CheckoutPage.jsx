import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createOrderAsync } from '../store/ordersSlice';

function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart);
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(createOrderAsync());
    if (createOrderAsync.fulfilled.match(resultAction)) {
      navigate('/confirmation', { state: { name, phone, total, orderId: resultAction.payload.order_id } });
    } else {
      alert('Ошибка при создании заказа: ' + resultAction.error.message);
    }
  };

  if (items.length === 0) {
    return <p>Корзина пуста. <a href="/">Вернуться в каталог</a></p>;
  }

  return (
    <div className="checkout-page">
      <h1>Оформление заказа</h1>
      <h3>Ваш заказ:</h3>
      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.name} × {item.quantity} = {item.price * item.quantity} ₽</li>
        ))}
      </ul>
      <p>Итого: {total} ₽</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Имя:</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Телефон:</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </div>
        <button type="submit" className="submit-btn" disabled={!name || !phone}>
          Подтвердить заказ
        </button>
      </form>
    </div>
  );
}

export default CheckoutPage;