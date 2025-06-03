// src/pages/ClientDashboard.js
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import ReconciliationUploader from '../components/ReconciliationUploader';

const ClientDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (json.success) {
          setUser(json.user);
        } else {
          logout();
        }
      } catch (err) {
        console.error('User fetch failed', err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (!localStorage.getItem('token')) return <Navigate to="/" />;
  if (loading) return <div className="p-6 text-center">Loading your dashboard...</div>;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Hello, {user?.firstName || 'Provider'}</h1>
          <p className="text-sm text-gray-600">You're logged in as a MedSpa Client.</p>
        </div>
        <button onClick={logout} className="bg-red-600 text-white px-4 py-2 rounded">
          Logout
        </button>
      </div>

      <div className="bg-white rounded shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Run a Reconciliation</h2>
        <p className="text-sm text-gray-600 mb-4">
          Upload your rewards reports and POS export to check for mismatches and reward claims.
        </p>
        <ReconciliationUploader />
      </div>
    </div>
  );
};

export default ClientDashboard;
