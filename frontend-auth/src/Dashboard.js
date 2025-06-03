import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Decode JWT token payload
  const parseJwt = (token) => {
    try {
      const base64Payload = token.split('.')[1];
      const payload = atob(base64Payload);
      return JSON.parse(payload);
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      const decoded = parseJwt(token);
      if (decoded && decoded.email) {
        setUser(decoded);
      } else {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <div className="card">
        <h2>Welcome to MedSpaSync Pro</h2>
        {user ? (
          <>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role || 'User'}</p>
          </>
        ) : (
          <p>Loading user info...</p>
        )}
        <button className="logout-btn" onClick={handleLogout}>Log Out</button>
      </div>
    </div>
  );
}

export default Dashboard;
