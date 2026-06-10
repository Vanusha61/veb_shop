import { useEffect, useState } from 'react';
import { apiGet, apiPost, apiPut, apiDelete } from '../api/client';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', price: '', stock: '' });

  const loadProducts = async () => {
    const data = await apiGet('/products');
    setProducts(data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await apiPut(`/products/${editing.id}`, form);
    } else {
      await apiPost('/products', form);
    }
    setEditing(null);
    setForm({ name: '', price: '', stock: '' });
    loadProducts();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Удалить товар?')) {
      await apiDelete(`/products/${id}`);
      loadProducts();
    }
  };

  const startEdit = (p) => {
    setEditing(p);
    setForm({ name: p.name, price: p.price, stock: p.stock });
  };

  return (
    <div className="container mt-4">
      <h2>Управление товарами</h2>
      <form onSubmit={handleSubmit} className="row g-3 mb-4">
        <div className="col">
          <input type="text" className="form-control" placeholder="Название" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
        </div>
        <div className="col">
          <input type="number" className="form-control" placeholder="Цена" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
        </div>
        <div className="col">
          <input type="number" className="form-control" placeholder="Кол-во" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} required />
        </div>
        <div className="col">
          <button type="submit" className="btn btn-primary">{editing ? 'Обновить' : 'Добавить'}</button>
          {editing && <button type="button" className="btn btn-secondary ms-2" onClick={() => { setEditing(null); setForm({ name: '', price: '', stock: '' }); }}>Отмена</button>}
        </div>
      </form>
      <table className="table">
        <thead>
          <tr><th>ID</th><th>Название</th><th>Цена</th><th>Остаток</th><th>Действия</th></tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.price}</td>
              <td>{p.stock}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => startEdit(p)}>Изменить</button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(p.id)}>Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
