import React from 'react';
import { PackageOpen } from 'lucide-react';

const EmptyState = ({ icon, title = 'Nothing here', message = 'No items to display.', action }) => (
  <div className="state-container">
    <div className="state-icon">
      {icon ?? <PackageOpen size={48} />}
    </div>
    <div className="state-title">{title}</div>
    <p className="state-message">{message}</p>
    {action && <div style={{ marginTop: 'var(--space-4)' }}>{action}</div>}
  </div>
);

export default EmptyState;
