const API_BASE = 'https://ubiquitous-space-disco-69pvpp6r6jvw3rjpx-5000.app.github.dev/api';

export const fetchWithToken = async (endpoint, method = 'GET', body = null) => {
  const token = localStorage.getItem('token');
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  };
  if (body) options.body = JSON.stringify(body);
  const res = await fetch(`${API_BASE}${endpoint}`, options);
  if (!res.ok) throw new Error((await res.json()).message || 'Fetch failed');
  return res.json();
};
