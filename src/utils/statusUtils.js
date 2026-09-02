/** Returns CSS color variable name for a status */
export const getStatusColor = (status) => {
  const map = {
    online:  'var(--color-online)',
    offline: 'var(--color-offline)',
    warning: 'var(--color-warning)',
    info:    'var(--color-info)',
  };
  return map[status?.toLowerCase()] ?? 'var(--color-text-muted)';
};

/** Returns background color for a status */
export const getStatusBg = (status) => {
  const map = {
    online:  'var(--color-online-bg)',
    offline: 'var(--color-offline-bg)',
    warning: 'var(--color-warning-bg)',
    info:    'var(--color-info-bg)',
  };
  return map[status?.toLowerCase()] ?? 'transparent';
};

/** Returns CSS class suffix for a status badge */
export const getStatusClass = (status) =>
  status?.toLowerCase() ?? 'info';

/** Returns display label for a status */
export const getStatusLabel = (status) => {
  const map = {
    online:  'Online',
    offline: 'Offline',
    warning: 'Warning',
    info:    'Info',
  };
  return map[status?.toLowerCase()] ?? status ?? 'Unknown';
};

/** Returns severity color for alerts */
export const getSeverityColor = (severity) => {
  const map = {
    HIGH:    'var(--color-offline)',
    WARNING: 'var(--color-warning)',
    INFO:    'var(--color-info)',
  };
  return map[severity?.toUpperCase()] ?? 'var(--color-text-muted)';
};

/** Returns severity background for alerts */
export const getSeverityBg = (severity) => {
  const map = {
    HIGH:    'var(--color-offline-bg)',
    WARNING: 'var(--color-warning-bg)',
    INFO:    'var(--color-info-bg)',
  };
  return map[severity?.toUpperCase()] ?? 'transparent';
};

/** Returns availability health label */
export const getHealthLabel = (pct) => {
  if (pct >= 95) return { label: 'Excellent', color: 'var(--color-online)' };
  if (pct >= 80) return { label: 'Good',      color: 'var(--color-info)' };
  if (pct >= 60) return { label: 'Fair',      color: 'var(--color-warning)' };
  return           { label: 'Poor',      color: 'var(--color-offline)' };
};
