import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, Legend,
} from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import ReconciliationUploader from './components/ReconciliationUploader';

const Dashboard = () => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/" />;

  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('7d');
  const [error, setError] = useState(null);

  const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  const exportPDF = () => {
    const input = document.getElementById('dashboard');
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 10, 10);
      pdf.save('dashboard.pdf');
    });
  };

  useEffect(() => {
    const controller = new AbortController();

    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });
        const json = await res.json();
        if (json.success) setUser(json.user);
        else logout();
      } catch (err) {
        if (err.name !== 'AbortError') logout();
      }
    };

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/analytics/summary?range=${filter}`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });
        const json = await res.json();
        if (json.success) setData(json.data);
        else setError('Failed to fetch analytics.');
        setLoading(false);
      } catch (err) {
        if (err.name !== 'AbortError') setError('Error fetching analytics.');
        setLoading(false);
      }
    };

    fetchUser();
    fetchAnalytics();

    return () => controller.abort(); // Cancel on unmount
  }, [filter]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-50">
        <div className="text-center">
          <p className="text-red-600 text-xl font-semibold">⚠️ {error}</p>
          <button onClick={logout} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100" id="dashboard">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {user?.firstName}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-300">Role: {user?.role}</p>
        </div>
        <div className="space-x-2">
          <select
            className="border px-2 py-1 rounded"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
          <button onClick={exportPDF} className="bg-green-600 text-white px-4 py-2 rounded">
            Export PDF
          </button>
          <button onClick={logout} className="bg-red-600 text-white px-4 py-2 rounded">
            Logout
          </button>
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse text-center text-gray-400">Loading dashboard...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data?.uploadTrends?.length > 0 && (
            <ChartCard title="Upload Trends">
              <LineChart data={data.uploadTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="uploads" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ChartCard>
          )}

          {data?.tierDistribution?.length > 0 && (
            <ChartCard title="Member Tier Distribution">
              <PieChart>
                <Pie
                  data={data.tierDistribution}
                  dataKey="value"
                  nameKey="tier"
                  cx="50%" cy="50%" outerRadius={100}
                >
                  {data.tierDistribution.map((entry, index) => (
                    <Cell key={index} fill={["#8884d8", "#82ca9d", "#ffc658"][index % 3]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ChartCard>
          )}

          {data?.failedPercentage?.length > 0 && (
            <ChartCard title="Failed Record Percentage">
              <BarChart data={data.failedPercentage}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#f87171" />
              </BarChart>
            </ChartCard>
          )}

          {data?.activePractices?.length > 0 && (
            <ChartCard title="Most Active Practices">
              <BarChart data={data.activePractices} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="practice" />
                <Tooltip />
                <Bar dataKey="uploads" fill="#60a5fa" />
              </BarChart>
            </ChartCard>
          )}
        </div>
      )}

      <div className="mt-10">
        <ReconciliationUploader />
      </div>
    </div>
  );
};

// 🔧 Reusable chart wrapper
const ChartCard = ({ title, children }) => (
  <div className="bg-white dark:bg-gray-800 shadow rounded p-4">
    <h2 className="font-bold mb-2">{title}</h2>
    <ResponsiveContainer width="100%" height={300}>
      {children}
    </ResponsiveContainer>
  </div>
);

export default Dashboard;
