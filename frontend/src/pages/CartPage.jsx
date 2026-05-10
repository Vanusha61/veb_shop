import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCart, updateCartItemAsync, removeFromCartAsync, clearCartAsync } from '../store/cartSlice';

function CartPage() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (status === 'loading') return <div>Загрузка...</div>;
  if (status === 'failed') return <div>Ошибка: {error}</div>;

  if (items.length === 0) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Корзина</h1>
        <p>Ваша корзина пуста.</p>
        <Link to="/">В каталог</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Корзина</h1>
      <table className="cart-table">
        <thead>
          <tr>
            <th>Товар</th>
            <th>Цена</th>
            <th>Кол-во</th>
            <th>Сумма</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.price} ₽</td>
              <td>
                <button onClick={() => dispatch(updateCartItemAsync({ itemId: item.id, quantity: item.quantity - 1 }))} disabled={item.quantity <= 1}>−</button>
                <span style={{ margin: '0 8px' }}>{item.quantity}</span>
                <button onClick={() => dispatch(updateCartItemAsync({ itemId: item.id, quantity: item.quantity + 1 }))}>+</button>
              </td>
              <td>{item.price * item.quantity} ₽</td>
              <td>
                <button onClick={() => dispatch(removeFromCartAsync(item.id))}>Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: '20px', textAlign: 'right' }}>
        <strong>Итого: {total} ₽</strong>
        <div style={{ marginTop: '10px' }}>
          <button onClick={() => dispatch(clearCartAsync())}>Очистить корзину</button>
          <Link to="/checkout">
            <button style={{ marginLeft: '10px' }}>Оформить заказ</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CartPage;