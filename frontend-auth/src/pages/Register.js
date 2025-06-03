import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '', firstName: '', lastName: '', rememberMe: false });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    if (!validateEmail(formData.email)) {
      return setError('❌ Invalid email format');
    }

    try {
      setIsSubmitting(true);
      const res = await fetch('https://ubiquitous-space-disco-69pvpp6r6jvw3rjpx-5000.app.github.dev/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Registration successful!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        throw new Error(data.message || 'Registration failed');
      }
    } catch (err) {
      setError(`❌ ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Create Account</h2>
        <input name="firstName" placeholder="First Name" onChange={handleChange} value={formData.firstName} required />
        <input name="lastName" placeholder="Last Name" onChange={handleChange} value={formData.lastName} required />
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
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>
        {message && <p className="success fade">{message}</p>}
        {error && <p className="error fade">{error}</p>}
      </form>
    </div>
  );
}

export default Register;
