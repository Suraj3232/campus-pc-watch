import React from 'react';

const StatCard = ({ icon, value, label, variant = 'accent' }) => (
  <div className={`stat-card ${variant}`}>
    <div className={`stat-icon ${variant}`}>
      {icon}
    </div>
    <div className="stat-body">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  </div>
);

export default StatCard;
