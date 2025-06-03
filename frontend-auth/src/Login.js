// src/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [failures, setFailures] = useState(0);
  const [retryCountdown, setRetryCountdown] = useState(0);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (retryCountdown > 0) return;

    try {
      const res = await fetch('https://ubiquitous-space-disco-69pvpp6r6jvw3rjpx-5000.app.github.dev/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Login successful!');
        setError('');
        localStorage.setItem('token', data.token);
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (err) {
      setMessage('');
      setError(`❌ ${err.message}`);
      const newFailures = failures + 1;
      setFailures(newFailures);
      if (newFailures >= 3) {
        setRetryCountdown(10);
        const countdown = setInterval(() => {
          setRetryCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(countdown);
              setFailures(0);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md">
        <h2 className="text-xl font-semibold text-center mb-4">MedSpaSync Login</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 mb-3 border rounded"
        />
        <input
          type={showPassword ? 'text' : 'password'}
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 mb-3 border rounded"
        />
        <div className="flex items-center justify-between mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="mr-2"
            />
            Remember Me
          </label>
          <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="text-sm text-blue-600">
            {showPassword ? 'Hide' : 'Show'} Password
          </button>
        </div>
        <button
          type="submit"
          disabled={retryCountdown > 0}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
        >
          {retryCountdown > 0 ? `Retrying in ${retryCountdown}s` : 'Login'}
        </button>
        {message && <p className="mt-3 text-green-600 text-sm">{message}</p>}
        {error && <p className="mt-3 text-red-600 text-sm">{error}</p>}
      </form>
    </div>
  );
}

export default Login;
