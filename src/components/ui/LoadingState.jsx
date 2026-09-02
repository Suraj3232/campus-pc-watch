import React from 'react';

const LoadingState = ({ message = 'Loading…' }) => (
  <div className="state-container">
    <div className="spinner spinner-lg" role="status" aria-label="Loading" />
    <p className="state-message">{message}</p>
  </div>
);

export default LoadingState;
