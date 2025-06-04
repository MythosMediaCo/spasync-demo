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
                    <button className="text-blue-600 hover:underline" disabled>
                      Export PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ClientDashboard;
