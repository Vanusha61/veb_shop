const API_BASE = '/api';

function getHeaders() {
  const token = localStorage.getItem('admin_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

export async function apiGet(url) {
  const res = await fetch(`${API_BASE}${url}`, { headers: getHeaders() });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiPost(url, data) {
  const res = await fetch(`${API_BASE}${url}`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiPut(url, data) {
  const res = await fetch(`${API_BASE}${url}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiDelete(url) {
  const res = await fetch(`${API_BASE}${url}`, {
    method: 'DELETE',
    headers: getHeaders()
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}