import React, { useState } from 'react';
import Papa from 'papaparse';

const ReconciliationUploader = () => {
  const [files, setFiles] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const parseCSV = (file) =>
    new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => resolve(results.data),
        error: reject,
      });
    });

  const handleSubmit = async () => {
    if (files.length !== 3) {
      alert('Please upload exactly 3 files.');
      return;
    }

    try {
      setLoading(true);
      const [file1, file2, file3] = await Promise.all(files.map(parseCSV));

      const res = await fetch('/api/reconciliation/json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ file1, file2, file3 }),
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to reconcile files.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded">
      <h2 className="text-xl font-bold mb-2">Upload and Reconcile Files</h2>
      <input
        type="file"
        accept=".csv"
        multiple
        onChange={handleFileChange}
        className="mb-4"
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? 'Reconciling...' : 'Start Reconciliation'}
      </button>

      {result && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Summary</h3>
          <pre className="bg-gray-100 p-2 rounded text-sm">
            {JSON.stringify(result.summary, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ReconciliationUploader;
