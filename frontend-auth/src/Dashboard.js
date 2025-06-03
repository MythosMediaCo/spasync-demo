// src/Dashboard.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell,
  LineChart, Line, CartesianGrid, Legend, ResponsiveContainer
} from 'recharts';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return navigate('/');

    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message);
        setUser(data.user);
      } catch {
        localStorage.removeItem('token');
        navigate('/');
      }
    };

    const fetchSummary = async () => {
      try {
        const res = await fetch('/api/analytics/summary', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setSummary(data);
      } catch {
        console.error('Failed to load summary');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
    fetchSummary();
  }, [navigate, token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (!user || loading || !summary) return <div className="p-6">Loading dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Welcome, {user.firstName} {user.lastName}</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload Trends */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="font-semibold text-lg mb-2">Upload Trends</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={summary.uploadTrends}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
              <Line type="monotone" dataKey="uploads" stroke="#3b82f6" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Member Tier Distribution */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="font-semibold text-lg mb-2">Member Tier Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={summary.tierDistribution} dataKey="count" nameKey="tier" outerRadius={90} fill="#8884d8" label>
                {summary.tierDistribution.map((entry, i) => (
                  <Cell key={`cell-${i}`} fill={['#0ea5e9', '#6366f1', '#10b981', '#f59e0b'][i % 4]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Failed Record % */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="font-semibold text-lg mb-2">Failed Record %</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={summary.failedRecords}>
              <XAxis dataKey="source" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="failureRate" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Most Active Practices */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="font-semibold text-lg mb-2">Most Active Practices</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={summary.activePractices}>
              <XAxis dataKey="practice" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="uploads" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
