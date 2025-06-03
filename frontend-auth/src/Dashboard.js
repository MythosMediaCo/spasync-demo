import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Protect route
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    // Optional: Fetch user details using token
    const payload = JSON.parse(atob(token.split('.')[1]));
    setUser(payload); // Assumes your token is a JWT with user data
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-xl mx-auto bg-white shadow-lg rounded-lg p-6 space-y-4">
        <h1 className="text-2xl font-bold text-center text-blue-600">Welcome, {user.firstName || 'User'}!</h1>
        <p className="text-center text-gray-700">Email: <span className="font-medium">{user.email}</span></p>
        <p className="text-center text-gray-700">Role: <span className="capitalize font-medium">{user.role}</span></p>

        <div className="text-center">
          <button
            onClick={handleLogout}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
