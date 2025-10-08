import React from 'react';

// Sample data for demonstration
const analyticsData = {
  totalEvents: 42,
  totalHosts: 18,
  pendingApprovals: 5,
};

// Component to display a single metric card
const MetricCard = ({ title, value }) => (
  <div className="metric-card">
    <p className="metric-value">{value}</p>
    <p className="metric-title">{title}</p>
  </div>
);

const MonitorAnalytics = () => {
  return (
    <div className="analytics-container">
      
      {/* Main Title */}
      <h1 className="title">Monitor Analytics</h1>
      
      {/* 1. Key Metric Cards */}
      <div className="metrics-grid">
        <MetricCard title="Total Events" value={analyticsData.totalEvents} />
        <MetricCard title="Total Hosts" value={analyticsData.totalHosts} />
        <MetricCard title="Pending Approvals" value={analyticsData.pendingApprovals} />
      </div>

      {/* 2. Placeholder for a Chart or Visualization */}
      <h2 className="subtitle" style={{ marginTop: '30px' }}>Approval Trends</h2>
      <div className="chart-placeholder">
        {/* In a real app, you'd use a library like Chart.js or Recharts here */}
        <p style={{ textAlign: 'center', paddingTop: '60px' }}>
          [Placeholder for Approval Rate Chart]
        </p>
      </div>
      
    </div>
  );
};

export default MonitorAnalytics;