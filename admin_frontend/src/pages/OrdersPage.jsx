import { useEffect, useState } from 'react';
import { apiGet, apiPut } from '../api/client';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  const loadOrders = async () => {
    const data = await apiGet('/admin/orders');
    setOrders(data);
  };

  useEffect(() => { loadOrders(); }, []);

  const updateStatus = async (orderId, newStatus) => {
    await apiPut(`/admin/orders/${orderId}/status`, { status: newStatus });
    loadOrders();
  };

  const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  return (
    <div className="container mt-4">
      <h2>Заказы</h2>
      <table className="table">
        <thead>
          <tr><th>ID</th><th>Клиент</th><th>Сумма</th><th>Статус</th><th>Действия</th></tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.customer_name}<br/><small>{order.customer_email}</small></td>
              <td>{order.total_price} ₽</td>
              <td>{order.status}</td>
              <td>
                <select value={order.status} onChange={e => updateStatus(order.id, e.target.value)} className="form-select">
                  {statuses.map(s => <option key={s}>{s}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}