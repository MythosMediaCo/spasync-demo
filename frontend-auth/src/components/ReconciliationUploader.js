import React, { useState } from 'react';
import Papa from 'papaparse';

const ReconciliationUploader = () => {
  const [files, setFiles] = useState([null, null, null]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (index, file) => {
    const newFiles = [...files];
    newFiles[index] = file;
    setFiles(newFiles);
  };

  const parseCSV = (file) =>
    new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (res) => resolve(res.data),
        error: (err) => reject(err),
      });
    });

  const handleSubmit = async () => {
    setError('');
    if (files.some((f) => !f)) {
      return setError('Please upload all 3 files.');
    }

    setLoading(true);

    try {
      const [file1Data, file2Data, file3Data] = await Promise.all(
        files.map((file) => parseCSV(file))
      );

      const res = await fetch('/api/reconciliation/json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          file1: file1Data,
          file2: file2Data,
          file3: file3Data,
        }),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.message || 'Reconciliation failed');

      setResults(json);
    } catch (err) {
      console.error('Reconciliation error:', err);
      setError(err.message || 'Error during reconciliation.');
    }

    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-lg font-bold mb-4">Reconciliation Uploader</h2>

      {[0, 1, 2].map((index) => (
        <div key={index} className="mb-4">
          <label className="block font-medium mb-1">
            File {index + 1}
          </label>
          <input
            type="file"
            accept=".csv"
            onChange={(e) => handleFileChange(index, e.target.files[0])}
            className="w-full border px-3 py-2 rounded"
          />
        </div>
      ))}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Reconciling...' : 'Run Reconciliation'}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {results && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Summary</h3>
          <ul className="list-disc pl-6 text-sm">
            <li>Exact Matches: {results.summary?.exactMatches}</li>
            <li>Fuzzy Matches: {results.summary?.fuzzyMatches}</li>
            <li>Unmatched: {results.summary?.unmatched}</li>
          </ul>

          <h4 className="mt-4 font-semibold">Sample Matches</h4>
          <pre className="bg-gray-100 p-2 mt-1 rounded text-xs overflow-x-auto">
            {JSON.stringify(results.samples, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ReconciliationUploader;
