import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './AuthPage';
import ClientDashboard from './ClientDashboard';

// Auth-protect client dashboard
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/auth" />;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route: Combined Login/Register */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Protected Client Dashboard */}
        <Route
          path="/client"
          element={
            <ProtectedRoute>
              <ClientDashboard />
            </ProtectedRoute>
          }
        />

        {/* Default redirect to login */}
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </Router>
  );
}

export default App;
