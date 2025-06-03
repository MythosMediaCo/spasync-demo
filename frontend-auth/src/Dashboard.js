import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, Legend,
} from 'recharts';
import ReconciliationUploader from './components/ReconciliationUploader';
import FilterControls from './components/FilterControls';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('7d');

  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/" />;

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const exportPDF = async () => {
    const html2canvas = (await import('html2canvas')).default;
    const jsPDF = (await import('jspdf')).default;
    const input = document.getElementById('dashboard');
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    pdf.addImage(imgData, 'PNG', 10, 10);
    pdf.save('dashboard.pdf');
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (json.success) setUser(json.user);
        else logout();
      } catch {
        logout();
      }
    };

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/analytics/summary?range=${filter}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (json.success) setData(json.data);
        setLoading(false);
      } catch {
        setLoading(false);
      }
    };

    fetchUser();
    fetchAnalytics();
  }, [filter]);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen" id="dashboard">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {user?.firstName}</h1>
          <p className="text-sm text-gray-500">Role: {user?.role}</p>
        </div>
        <FilterControls filter={filter} setFilter={setFilter} onExport={exportPDF} onLogout={logout} />
      </div>

      {loading && <p className="text-center text-gray-500">Loading analytics...</p>}

      {!loading && data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.uploadTrends?.length > 0 && (
            <div className="bg-white shadow rounded p-4">
              <h2 className="font-bold mb-2">Upload Trends</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.uploadTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="uploads" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {data.tierDistribution?.length > 0 && (
            <div className="bg-white shadow rounded p-4">
              <h2 className="font-bold mb-2">Member Tier Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={data.tierDistribution} dataKey="value" nameKey="tier" cx="50%" cy="50%" outerRadius={100}>
                    {data.tierDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={["#8884d8", "#82ca9d", "#ffc658"][index % 3]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {data.failedPercentage?.length > 0 && (
            <div className="bg-white shadow rounded p-4">
              <h2 className="font-bold mb-2">Failed Record Percentage</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.failedPercentage}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#f87171" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {data.activePractices?.length > 0 && (
            <div className="bg-white shadow rounded p-4">
              <h2 className="font-bold mb-2">Most Active Practices</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data.activePractices} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="practice" />
                  <Tooltip />
                  <Bar dataKey="uploads" fill="#60a5fa" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      <div className="mt-10">
        <ReconciliationUploader />
      </div>
    </div>
  );
};

export default Dashboard;
