import React, { useEffect, useState } from 'react';

function ClientDashboard() {
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fileType, setFileType] = useState('All');
  const [dateRange, setDateRange] = useState('All');

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      window.location.href = '/login';
      return;
    }

    const fetchData = async () => {
      try {
        // Get user
        const userRes = await fetch('https://medspasync-backend-production.up.railway.app/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await userRes.json();
        setUser(userData);

        // Get upload history
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

    if (fileType !== 'All') {
      filteredData = filteredData.filter((h) => h.fileType === fileType);
    }

    if (dateRange !== 'All') {
      const now = new Date();
      const days = dateRange === '30' ? 30 : 90;
      const cutoff = new Date(now.setDate(now.getDate() - days));
      filteredData = filteredData.filter((h) => new Date(h.uploadDate) > cutoff);
    }

    setFiltered(filteredData);
  }, [history, fileType, dateRange]);

  const handleExport = async (uploadId) => {
    try {
      const res = await fetch(
        `https://medspasync-backend-production.up.railway.app/api/upload/export/${uploadId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
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

  if (loading) return <p className="p-6 text-gray-600">Loading your dashboard...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Hi, {user.practice?.name || user.firstName} 👋</h1>

      <div className="mb-4 flex flex-wrap gap-4 items-center">
        <div>
          <label className="block text-sm font-medium mb-1">File Type</label>
          <select
            value={fileType}
            onChange={(e) => setFileType(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="All">All</option>
            <option value="POS">POS</option>
            <option value="Alle">Alle</option>
            <option value="Aspire">Aspire</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Date Range</label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="All">All Time</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
          </select>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4">Reconciliation History</h2>
      {filtered.length === 0 ? (
        <p className="text-gray-600">No results found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded shadow">
            <thead>
              <tr className="bg-gray-100 text-left text-sm text-gray-700">
                <th className="py-2 px-4 border-b">Date</th>
                <th className="py-2 px-4 border-b">File Type</th>
