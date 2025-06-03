// components/FilterControls.js
import React from 'react';

const FilterControls = ({ filter, onFilterChange, onExportPDF, onLogout }) => {
  return (
    <div className="space-x-2">
      <select
        className="border px-2 py-1 rounded"
        value={filter}
        onChange={(e) => onFilterChange(e.target.value)}
      >
        <option value="7d">Last 7 Days</option>
        <option value="30d">Last 30 Days</option>
        <option value="90d">Last 90 Days</option>
      </select>
      <button onClick={onExportPDF} className="bg-green-600 text-white px-4 py-2 rounded">
        Export PDF
      </button>
      <button onClick={onLogout} className="bg-red-600 text-white px-4 py-2 rounded">
        Logout
      </button>
    </div>
  );
};

export default FilterControls;
