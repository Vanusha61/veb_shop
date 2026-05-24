import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function OrdersPage() {
  const { token, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const headers = { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token };

  const fetchOrders = async () => {
    const res = await fetch('http://localhost:8001/admin/orders', { headers });
    setOrders(await res.json());
  };
  useEffect(() => { fetchOrders(); }, []);

  const changeStatus = async (id, status) => {
    await fetch(`http://localhost:8001/orders/${id}/status`, {
      method: 'PUT', headers, body: JSON.stringify({ status })
    });
    fetchOrders();
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>Заказы</h2><button onClick={logout}>Выйти</button>
      </div>
      <table border={1} cellPadding={5} width="100%">
        <thead><tr><th>ID</th><th>Статус</th><th>Сумма</th><th>Дата</th><th>Изменить</th></tr></thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.order_id}>
              <td>{o.order_id}</td><td>{o.status}</td><td>{o.total}</td><td>{new Date(o.created_at).toLocaleString()}</td>
              <td>
                <select value={o.status} onChange={e => changeStatus(o.order_id, e.target.value)}>
                  <option value="created">Создан</option>
                  <option value="confirmed">Подтверждён</option>
                  <option value="shipped">Отправлен</option>
                  <option value="delivered">Доставлен</option>
                  <option value="cancelled">Отменён</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 20 }}><a href="/">К товарам</a></div>
    </div>
  );
}
