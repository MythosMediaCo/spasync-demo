import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, Tooltip, XAxis, YAxis, ResponsiveContainer
} from 'recharts';

function ClientDashboard() {
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fileType, setFileType] = useState('All');
  const [dateRange, setDateRange] = useState('All');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      window.location.href = '/login';
      return;
    }

    const fetchData = async () => {
      try {
        const userRes = await fetch('https://medspasync-backend-production.up.railway.app/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await userRes.json();
        setUser(userData);

        const historyRes = await fetch('https://medspasync-backend-production.up.railway.app/api/upload/history', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const historyData = await historyRes.json();
        setHistory(historyData);
        setLoading(false);
      } catch (err) {
        console.error('Error loading dashboard:', err);
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    let filteredData = [...history];
    if (fileType !== 'All') filteredData = filteredData.filter(h => h.fileType === fileType);
    if (dateRange !== 'All') {
      const now = new Date();
      const days = dateRange === '30' ? 30 : 90;
      const cutoff = new Date(now.setDate(now.getDate() - days));
      filteredData = filteredData.filter(h => new Date(h.uploadDate) > cutoff);
    }
    setFiltered(filteredData);
  }, [history, fileType, dateRange]);

  const handleExport = async (uploadId) => {
    try {
      const res = await fetch(
        `https://medspasync-backend-production.up.railway.app/api/upload/export/${uploadId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Reconciliation-${uploadId}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
      alert('Failed to export PDF.');
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const result = {
          fileType: 'POS', // placeholder
          matchRate: Math.random() * 0.2 + 0.8,
          revenueRecovered: Math.random() * 5000 + 2000,
        };
        await fetch('https://medspasync-backend-production.up.railway.app/api/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(result),
        });
        setShowUploadModal(false);
        window.location.reload();
      };
      reader.readAsText(file);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  // Chart Data
  const chartData = filtered.map(h => ({
    date: new Date(h.uploadDate).toLocaleDateString(),
    matchRate: parseFloat((h.matchRate * 100).toFixed(1)),
    revenue: h.revenueRecovered,
    type: h.fileType,
  }));

  const fileTypeCounts = filtered.reduce((acc, h) => {
    acc[h.fileType] = (acc[h.fileType] || 0) + 1;
    return acc;
  }, {});
  const pieData = Object.entries(fileTypeCounts).map(([type, count]) => ({ name: type, value: count }));
  const pieColors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50'];

  if (loading) return <p className="p-6 text-gray-600">Loading your dashboard...</p>;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Hi, {user.practice?.name || user.firstName} 👋</h1>
        <button
          onClick={() => setShowUploadModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Start New Reconciliation
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">File Type</label>
          <select value={fileType} onChange={(e) => setFileType(e.target.value)} className="border px-3 py-2 rounded">
            <option value="All">All</option>
            <option value="POS">POS</option>
            <option value="Alle">Alle</option>
            <option value="Aspire">Aspire</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Date Range</label>
          <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="border px-3 py-2 rounded">
            <option value="All">All Time</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
          </select>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-sm font-semibold mb-2">Match Rate % Over Time</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <XAxis dataKey="date" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="matchRate" stroke="#4f46e5" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-sm font-semibold mb-2">Revenue Recovered ($)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-sm font-semibold mb-2">File Type Breakdown</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={60}>
                {pieData.map((_, idx) => (
                  <Cell key={`cell-${idx}`} fill={pieColors[idx % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {
