import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try { await login(username, password); } catch (err) { setError(err.message); }
  };

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', textAlign: 'center' }}>
      <h2>Вход в панель управления</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Логин" value={username} onChange={e => setUsername(e.target.value)} required style={{ width: '100%', padding: '8px', marginBottom: '10px' }} />
        <input type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', padding: '8px', marginBottom: '10px' }} />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={{ padding: '10px 20px' }}>Войти</button>
      </form>
    </div>
  );
}
