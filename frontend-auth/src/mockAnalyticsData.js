const mockAnalytics = {
  uploadsByMonth: [
    { month: 'Jan', uploads: 30 },
    { month: 'Feb', uploads: 45 },
    { month: 'Mar', uploads: 70 },
    { month: 'Apr', uploads: 65 },
  ],
  memberTierDistribution: [
    { tier: 'Trial', count: 15 },
    { tier: 'Basic', count: 25 },
    { tier: 'Pro', count: 40 },
    { tier: 'Enterprise', count: 10 },
  ],
  failedRecordRate: [
    { label: 'Success', value: 92 },
    { label: 'Failed', value: 8 },
  ],
  activePractices: [
    { practice: 'Renew Aesthetics', uploads: 18 },
    { practice: 'GlowRx', uploads: 11 },
    { practice: 'Skinfinity Spa', uploads: 9 },
  ],
  trialExpirations: [
    { date: '2025-06-01', expiring: 4 },
    { date: '2025-06-02', expiring: 7 },
    { date: '2025-06-03', expiring: 3 },
  ],
};

export default mockAnalytics;
