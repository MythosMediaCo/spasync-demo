import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [uploadTrends, setUploadTrends] = useState([]);
  const [memberDistribution, setMemberDistribution] = useState([]);
  const [failedRecords, setFailedRecords] = useState([]);
  const [activePractices, setActivePractices] = useState([]);
  const [trialExpirations, setTrialExpirations] = useState([]);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return navigate('/');

    const fetchUserAndAnalytics = async () => {
      try {
        const [userRes, analyticsRes] = await Promise.all([
          fetch('https://ubiquitous-space-disco-69pvpp6r6jvw3rjpx-5000.app.github.dev/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch('https://ubiquitous-space-disco-69pvpp6r6jvw3rjpx-5000.app.github.dev/api/analytics/summary', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        const userData = await userRes.json();
        const analyticsData = await analyticsRes.json();

        if (userRes.ok && userData.success) setUser(userData.user);
        if (analyticsRes.ok && analyticsData.success) {
          setUploadTrends(analyticsData.data.uploadTrends);
          setMemberDistribution(analyticsData.data.memberTierDistribution);
          setFailedRecords(analyticsData.data.failedRecordPercentage);
          setActivePractices(analyticsData.data.mostActivePractices);
          setTrialExpirations(analyticsData.data.trialExpirationHeatmap);
        }
      } catch (err) {
        console.error('❌ Dashboard fetch error:', err);
        navigate('/');
      }
    };

    fetchUserAndAnalytics();
  }, [navigate, token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1'];

  return (
    <div className="dashboard">
      <header>
        <h1>Welcome, {user?.firstName} {user?.lastName}</h1>
        <p>{user?.email} ({user?.role})</p>
        <button onClick={handleLogout}>Logout</button>
      </header>

      <div className="charts-grid">
        <div className="chart-card">
          <h2>📈 Upload Trends</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={uploadTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2>🎯 Member Tier Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={memberDistribution} dataKey="value" nameKey="tier" cx="50%" cy="50%" outerRadius={80} label>
                {memberDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2>⚠️ Failed Record %</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={failedRecords}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fileType" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="failRate" fill="#ff6b6b" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2>🏢 Most Active Practices</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={activePractices} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="practice" type="category" />
              <Tooltip />
              <Bar dataKey="uploads" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2>🗓️ Trial Expiration Heatmap</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={trialExpirations}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="expiring" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
