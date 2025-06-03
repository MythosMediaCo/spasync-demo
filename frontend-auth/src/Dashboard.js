import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  HeatMap,
  Legend,
} from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import ReconciliationUploader from './components/ReconciliationUploader';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('7d');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchUser = async () => {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) setUser(json.user);
    };

    const fetchAnalytics = async () => {
      setLoading(true);
      const res = await fetch(`/api/analytics/summary?range=${filter}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (json.success) setData(json.data);
      setLoading(false);
    };

    fetchUser();
    fetchAnalytics();
  }, [filter]);

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

  if (!localStorage.getItem('token')) return <Navigate to="/" />;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen" id="dashboard">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {user?.firstName}</h1>
          <p className="text-sm text-gray-500">Role: {user?.role}</p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded p-4">
          <h2 className="font-bold mb-2">Upload Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data?.uploadTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="uploads" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white shadow rounded p-4">
          <h2 className="font-bold mb-2">Member Tier Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={data?.tierDistribution} dataKey="value" nameKey="tier" cx="50%" cy="50%" outerRadius={100}>
                {data?.tierDistribution?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={["#8884d8", "#82ca9d", "#ffc658"][index % 3]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white shadow rounded p-4">
          <h2 className="font-bold mb-2">Failed Record Percentage</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data?.failedPercentage}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#f87171" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white shadow rounded p-4">
          <h2 className="font-bold mb-2">Most Active Practices</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data?.activePractices} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="practice" />
              <Tooltip />
              <Bar dataKey="uploads" fill="#60a5fa" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 🔁 Reconciliation uploader added at the bottom */}
      <div className="mt-10">
        <ReconciliationUploader />
      </div>
    </div>
  );
};

export default Dashboard;
