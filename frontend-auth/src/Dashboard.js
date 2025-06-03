import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell,
  BarChart, Bar, ResponsiveContainer, HeatMapChart
} from 'recharts';
import mockAnalytics from './mockAnalyticsData';

const COLORS = ['#4ADE80', '#60A5FA', '#F472B6', '#FBBF24', '#F87171'];

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndAnalytics = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const userRes = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!userRes.ok) throw new Error('User fetch failed');
        const userData = await userRes.json();
        setUser(userData.user);

        const analyticsRes = await fetch('/api/analytics/summary', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!analyticsRes.ok) throw new Error('Analytics fetch failed');
        const analyticsData = await analyticsRes.json();
        if (!analyticsData.success) throw new Error('Bad analytics response');
        setAnalytics(analyticsData.analytics);
      } catch (err) {
        console.warn('Fallback to mock data:', err.message);
        setAnalytics(mockAnalytics);
      }
    };

    fetchUserAndAnalytics();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!user || !analytics) return <div className="text-center p-10">Loading dashboard...</div>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Welcome, {user.firstName} {user.lastName}</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
      </div>

      {/* Upload Trends */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Upload Trends</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={analytics.uploadsByMonth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="uploads" stroke="#4ADE80" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Member Tier Distribution */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Member Tier Distribution</h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={analytics.memberTierDistribution} dataKey="count" nameKey="tier" cx="50%" cy="50%" outerRadius={80} label>
              {analytics.memberTierDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Failed Record Rate */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Failed Record Percentage</h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={analytics.failedRecordRate} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={80} label>
              {analytics.failedRecordRate.map((entry, index) => (
                <Cell key={`fail-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Active Practices */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Most Active Practices</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={analytics.activePractices}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="practice" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="uploads" fill="#60A5FA" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Trial Expiration Heatmap (Basic Example as Bar Chart) */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Upcoming Trial Expirations</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={analytics.trialExpirations}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="expiring" fill="#FBBF24" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
