import React, { useState } from 'react';
import './App.css';

function App() {
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [failures, setFailures] = useState(0);
  const [retryCountdown, setRetryCountdown] = useState(0);

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
        setTimeout(() => window.location.href = '/dashboard', 1500); // Simulate redirect
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
    <div className="App">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>MedSpaSync Login</h2>
        <input name="email" placeholder="Email" onChange={handleChange} value={formData.email} required />
        <input
          name="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          onChange={handleChange}
          value={formData.password}
          required
        />
        <div className="form-extras">
          <label>
            <input type="checkbox" checked={formData.rememberMe} onChange={handleChange} name="rememberMe" />
            Remember Me
          </label>
          <button type="button" onClick={() => setShowPassword((prev) => !prev)}>
            {showPassword ? 'Hide' : 'Show'} Password
          </button>
        </div>
        <button type="submit" disabled={retryCountdown > 0}>
          {retryCountdown > 0 ? `Retrying in ${retryCountdown}s` : 'Login'}
        </button>
        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}

export default App;
