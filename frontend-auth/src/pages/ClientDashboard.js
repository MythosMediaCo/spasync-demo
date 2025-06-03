import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ClientDashboard = () => {
  const [client, setClient] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('client_token');
  if (!token) return <Navigate to="/client-login" />;

  const logout = () => {
    localStorage.removeItem('client_token');
    window.location.href = '/client-login';
  };

  const exportPDF = () => {
    const input = document.getElementById('client-dashboard');
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 10, 10);
      pdf.save('reconciliation_history.pdf');
    });
  };

  useEffect(() => {
    const fetchClientInfo = async () => {
      try {
        const res = await fetch('/api/client/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (json.success) setClient(json.client);
        else logout();
      } catch {
        logout();
      }
    };

    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/client/reconciliation/history', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (json.success) setHistory(json.data);
      } catch {
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClientInfo();
    fetchHistory();
  }, []);

  return (
    <div className="p-6 bg-white min-h-screen" id="client-dashboard">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Hello, {client?.name}</h1>
          <p className="text-gray-500 text-sm">Welcome to your reconciliation portal</p>
        </div>
        <div className="space-x-2">
          <button onClick={exportPDF} className="bg-blue-600 text-white px-4 py-2 rounded">
            Export History
          </button>
          <button onClick={logout} className="bg-red-600 text-white px-4 py-2 rounded">
            Logout
          </button>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-3">Reconciliation History</h2>
        {loading ? (
          <p>Loading history...</p>
        ) : history.length === 0 ? (
          <p className="text-gray-500">No reconciliations found.</p>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-2">Date</th>
                <th className="p-2">Exact Matches</th>
                <th className="p-2">Fuzzy Matches</th>
                <th className="p-2">Unmatched</th>
              </tr>
            </thead>
            <tbody>
              {history.map((record, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-2">{new Date(record.createdAt).toLocaleDateString()}</td>
                  <td className="p-2">{record.exactMatches}</td>
                  <td className="p-2">{record.fuzzyMatches}</td>
                  <td className="p-2">{record.unmatched}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;
