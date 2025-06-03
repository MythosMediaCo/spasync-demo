import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, HeatMapChart
} from 'recharts';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token] = useState(localStorage.getItem('token'));
  const [data, setData] = useState({
    uploadTrends: [],
    tierDistribution: [],
    failedRecords: 0,
    activePractices: [],
    trialExpirations: []
  });

  useEffect(() => {
    if (!token) return navigate('/');

    const fetchUserData = async () => {
      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const result = await res.json();
        if (!result.success) throw new Error();
        setUser(result.user);

        // Replace with real fetch to your dashboard analytics API route
        setData({
          uploadTrends: [
            { date: 'Mon', uploads: 2 },
            { date: 'Tue', uploads: 5 },
            { date: 'Wed', uploads: 3 },
            { date: 'Thu', uploads: 7 },
            { date: 'Fri', uploads: 1 },
          ],
          tierDistribution: [
            { tier: 'Trial', value: 10 },
            { tier: 'Basic', value: 20 },
            { tier: 'Pro', value: 8 },
            { tier: 'Enterprise', value: 2 }
          ],
          failedRecords: 12,
          activePractices: [
            { name: 'Renu Medispa', uploads: 9 },
            { name: 'Glow Clinic', uploads: 6 },
            { name: 'Skin Haven', uploads: 4 }
          ],
          trialExpirations: [
            { day: '2025-06-01', expiring: 2 },
            { day: '2025-06-02', expiring: 5 },
            { day: '2025-06-03', expiring: 1 }
          ]
        });
      } catch {
        localStorage.removeItem('token');
        navigate('/');
      }
    };

    fetchUserData();
  }, [navigate, token]);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Welcome, {user?.firstName} {user?.lastName}</h2>
        <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={logout}>Logout</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload Trends */}
        <div className="bg-white shadow-md p-4 rounded">
          <h3 className="text-lg font-semibold mb-2">Upload Trends</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data.uploadTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="uploads" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Member Tier Distribution */}
        <div className="bg-white shadow-md p-4 rounded">
          <h3 className="text-lg font-semibold mb-2">Member Tier Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={data.tierDistribution} dataKey="value" nameKey="tier" cx="50%" cy="50%" outerRadius={60}>
                {data.tierDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={["#6366f1", "#3b82f6", "#06b6d4", "#10b981"][index % 4]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Failed Record % */}
        <div className="bg-white shadow-md p-4 rounded">
          <h3 className="text-lg font-semibold mb-2">Failed Records</h3>
          <p className="text-4xl font-bold text-red-600">{data.failedRecords}%</p>
        </div>

        {/* Most Active Practices */}
        <div className="bg-white shadow-md p-4 rounded">
          <h3 className="text-lg font-semibold mb-2">Most Active Practices</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.activePractices}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="uploads" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Trial Expiration Heatmap - simulated with bar */}
        <div className="bg-white shadow-md p-4 rounded">
          <h3 className="text-lg font-semibold mb-2">Trial Expiration Activity</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data.trialExpirations}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="expiring" fill="#f59e0b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
