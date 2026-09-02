import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ErrorState = ({ message = 'Something went wrong.', onRetry }) => (
  <div className="state-container">
    <div className="state-icon" style={{ color: 'var(--color-offline)' }}>
      <AlertTriangle size={48} />
    </div>
    <div className="state-title">Error</div>
    <p className="state-message">{message}</p>
    {onRetry && (
      <button className="btn btn-secondary" onClick={onRetry} style={{ marginTop: 'var(--space-4)' }}>
        Try Again
      </button>
    )}
  </div>
);

export default ErrorState;
