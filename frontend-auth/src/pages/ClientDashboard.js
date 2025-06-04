import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
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

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const parsedData = results.data;

          const response = await fetch('https://medspasync-backend-production.up.railway.app/api/reconciliation/upload/json', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ data: parsedData }),
          });

          if (!response.ok) throw new Error('Upload failed');

          setShowUploadModal(false);
          window.location.reload();
        } catch (err) {
          console.error('Upload failed:', err);
          alert('Failed to process file.');
        } finally {
          setUploading(false);
        }
      },
      error: (err) => {
        console.error('Parse error:', err);
        alert('File could not be parsed.');
        setUploading(false);
      }
    });
  };

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

      {/* Table */}
      <h2 className="text-xl font-semibold mt-6">Reconciliation History</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead>
            <tr className="bg-gray-100 text-left text-sm text-gray-700">
              <th className="py-2 px-4 border-b">Date</th>
              <th className="py-2 px-4 border-b">File Type</th>
              <th className="py-2 px-4 border-b">Match Rate</th>
              <th className="py-2 px-4 border-b">Revenue Recovered</th>
              <th className="py-2 px-4 border-b">Export</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, idx) => (
              <tr key={idx} className="text-sm">
                <td className="py-2 px-4 border-b">{new Date(item.uploadDate).toLocaleDateString()}</td>
                <td className="py-2 px-4 border-b">{item.fileType}</td>
                <td className="py-2 px-4 border-b">{(item.matchRate * 100).toFixed(1)}%</td>
                <td className="py-2 px-4 border-b">${item.revenueRecovered?.toFixed(2) || '0.00'}</td>
                <td className="py-2 px-4 border-b">
                  <button onClick={() => handleExport(item._id)} className="text-blue-600 hover:underline">
                    Export PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Upload Reconciliation File</h3>
            <input type="file" accept=".csv" onChange={handleUpload} className="mb-4" />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowUploadModal(false)} className="text-sm px-4 py-2">Cancel</button>
              <button disabled={uploading} className="bg-blue-600 text-white px-4 py-2 rounded">
                {uploading ? 'Uploading...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClientDashboard;
