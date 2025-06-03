// src/components/ClientReconciliationHistory.js
import React, { useEffect, useState } from 'react';

const ClientReconciliationHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch('/api/client/reconciliation-history', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(json => {
        if (json.success) setHistory(json.history);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-gray-500">Loading history...</p>;

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Reconciliation History</h2>
      {history.length === 0 ? (
        <p className="text-gray-500">No past reconciliations found.</p>
      ) : (
        <table className="w-full text-sm text-left border">
          <thead>
            <tr className="bg-gray-100 text-xs uppercase">
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Exact</th>
              <th className="p-2 border">Fuzzy</th>
              <th className="p-2 border">Unmatched</th>
              <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {history.map((entry, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-2 border">{new Date(entry.timestamp).toLocaleDateString()}</td>
                <td className="p-2 border">{entry.summary.exactMatches}</td>
                <td className="p-2 border">{entry.summary.fuzzyMatches}</td>
                <td className="p-2 border">{entry.summary.unmatched}</td>
                <td className="p-2 border text-green-600">✓ Completed</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ClientReconciliationHistory;
