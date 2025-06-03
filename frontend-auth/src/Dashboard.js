import React, { useEffect, useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const userRes = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!userRes.ok) throw new Error('User not authenticated');
        const userData = await userRes.json();
        setUser(userData.user);

        const analyticsRes = await fetch('/api/analytics/summary', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!analyticsRes.ok) throw new Error('Failed to fetch analytics');
        const analyticsData = await analyticsRes.json();
        setAnalytics(analyticsData);
        setLoading(false);
      } catch (err) {
        console.error(err);
        navigate('/login');
      }
    };

    fetchData();
  }, [token, navigate]);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) return <div className="p-6 text-center text-gray-500">Loading dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Welcome, {user?.firstName}</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Upload Trends</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={analytics?.uploadTrends}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="uploads" stroke="#3b82f6" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Member Tier Distribution</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={analytics?.memberTiers}
                dataKey="count"
                nameKey="tier"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {analytics?.memberTiers.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#6366f1', '#3b82f6', '#10b981', '#f59e0b'][index % 4]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Failed Record Rate</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={analytics?.failedRecordRate}>
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="failureRate" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Top Active Practices</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={analytics?.topPractices}>
              <XAxis dataKey="practiceName" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="uploadCount" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded shadow col-span-1 md:col-span-2">
          <h2 className="text-lg font-semibold mb-2">Trial Expiration Heatmap</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={analytics?.trialExpirations}>
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="expiringCount" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;