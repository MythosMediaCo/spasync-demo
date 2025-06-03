import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';

// ✅ Login Component
function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '', rememberMe: false });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [failures, setFailures] = useState(0);
  const [retryCountdown, setRetryCountdown] = useState(0);

  // 🔄 Auto-fill email if remembered
  useEffect(() => {
    const savedEmail = localStorage.getItem('savedEmail');
    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail, rememberMe: true }));
    }
  }, []);

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
        if (formData.rememberMe) {
          localStorage.setItem('savedEmail', formData.email);
        } else {
          localStorage.removeItem('savedEmail');
        }
        setTimeout(() => navigate('/dashboard'), 1200);
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
    <div className="App fade-in">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>MedSpaSync Login</h2>
        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          value={formData.email}
          autoComplete="email"
          required
        />
        <input
          name="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          onChange={handleChange}
          value={formData.password}
          autoComplete="current-password"
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
        {message && <p className="success fade-in">{message}</p>}
        {error && <p className="error fade-in">{error}</p>}
      </form>
    </div>
  );
}

// ✅ Placeholder Dashboard
function Dashboard() {
  return (
    <div className="dashboard fade-in">
      <h2>Welcome to MedSpaSync Dashboard</h2>
      <p>This is a protected route.</p>
    </div>
  );
}

// ✅ Main App with Routes
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
