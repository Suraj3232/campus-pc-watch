import React from 'react';
import { getStatusClass, getStatusLabel } from '../../utils/statusUtils';

const StatusBadge = ({ status }) => {
  const cls   = getStatusClass(status);
  const label = getStatusLabel(status);
  return (
    <span className={`badge badge-${cls}`} role="status" aria-label={`Status: ${label}`}>
      <span
        style={{
          display: 'inline-block',
          width: 6, height: 6,
          borderRadius: '50%',
          background: 'currentColor',
          animation: status === 'online' ? 'onlinePulse 2s ease-in-out infinite' : 'none',
        }}
      />
      {label}
    </span>
  );
};

export default StatusBadge;
