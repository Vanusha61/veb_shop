import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ProductsPage() {
  const { token, logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [editId, setEditId] = useState(null);

  const headers = { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token };

  const fetchProducts = async () => {
    const res = await fetch('http://localhost:8000/products');
    setProducts(await res.json());
  };
  useEffect(() => { fetchProducts(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = JSON.stringify({ name, price: +price, stock_quantity: +stock });
    const url = editId ? `http://localhost:8000/products/${editId}` : 'http://localhost:8000/products';
    await fetch(url, { method: editId ? 'PUT' : 'POST', headers, body });
    setName(''); setPrice(''); setStock(''); setEditId(null);
    fetchProducts();
  };

  const handleEdit = (p) => { setName(p.name); setPrice(p.price.toString()); setStock(p.stock_quantity.toString()); setEditId(p.id); };
  const handleDelete = async (id) => {
    if (window.confirm('Удалить?')) {
      await fetch(`http://localhost:8000/products/${id}`, { method: 'DELETE', headers });
      fetchProducts();
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>Товары</h2><button onClick={logout}>Выйти</button>
      </div>
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input placeholder="Название" value={name} onChange={e => setName(e.target.value)} required />
        <input type="number" placeholder="Цена" value={price} onChange={e => setPrice(e.target.value)} required style={{ marginLeft: 10 }} />
        <input type="number" placeholder="Остаток" value={stock} onChange={e => setStock(e.target.value)} required style={{ marginLeft: 10 }} />
        <button type="submit" style={{ marginLeft: 10 }}>{editId ? 'Сохранить' : 'Добавить'}</button>
        {editId && <button type="button" onClick={() => { setName(''); setPrice(''); setStock(''); setEditId(null); }}>Отмена</button>}
      </form>
      <table border={1} cellPadding={5} width="100%">
        <thead><tr><th>ID</th><th>Название</th><th>Цена</th><th>Остаток</th><th></th></tr></thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td><td>{p.name}</td><td>{p.price}</td><td>{p.stock_quantity}</td>
              <td>
                <button onClick={() => handleEdit(p)}>Ред.</button>
                <button onClick={() => handleDelete(p.id)} style={{ marginLeft: 5 }}>Уд.</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 20 }}><a href="/orders">К заказам</a></div>
    </div>
  );
}
