import { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('admin_token'));
  const navigate = useNavigate();

  const login = async (username, password) => {
    const res = await fetch('http://localhost:8002/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!res.ok) throw new Error('Неверный логин/пароль');
    const data = await res.json();
    setToken(data.access_token);
    localStorage.setItem('admin_token', data.access_token);
    navigate('/');
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('admin_token');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
