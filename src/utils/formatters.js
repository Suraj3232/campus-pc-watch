/**
 * Parse any timestamp representation (Firestore Timestamp, Date, ISO string, epoch ms)
 * into a valid JavaScript Date object.
 */
export const toDateObj = (val) => {
  if (!val) return null;
  if (typeof val.toDate === 'function') {
    try {
      const d = val.toDate();
      if (d instanceof Date && !isNaN(d.getTime())) return d;
    } catch {
      // fallback
    }
  }
  if (typeof val.toMillis === 'function') {
    try {
      const m = val.toMillis();
      if (m) return new Date(m);
    } catch {
      // fallback
    }
  }
  if (typeof val.seconds === 'number') {
    return new Date(val.seconds * 1000 + Math.floor((val.nanoseconds || 0) / 1000000));
  }
  if (val instanceof Date) {
    return isNaN(val.getTime()) ? null : val;
  }
  if (typeof val === 'number') {
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d;
  }
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d;
};

/** Format ISO/Firestore timestamp to "just now", "21 seconds ago", "1 minute ago", etc. */
export const timeAgo = (isoOrTimestamp) => {
  const d = toDateObj(isoOrTimestamp);
  if (!d) return '—';

  const diffMs  = Math.max(0, Date.now() - d.getTime());
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 5) return 'just now';
  if (diffSec < 60) return `${diffSec} seconds ago`;

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin === 1) return '1 minute ago';
  if (diffMin < 60) return `${diffMin} minutes ago`;

  const diffHr = Math.floor(diffMin / 60);
  if (diffHr === 1) return '1 hour ago';
  if (diffHr < 24) return `${diffHr} hours ago`;

  const diffDay = Math.floor(diffHr / 24);
  if (diffDay === 1) return '1 day ago';
  return `${diffDay} days ago`;
};

/** Format ISO/Firestore timestamp to readable date string */
export const formatDate = (isoOrTimestamp) => {
  const d = toDateObj(isoOrTimestamp);
  if (!d) return '—';
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

/** Format ISO/Firestore timestamp to date + time */
export const formatDateTime = (isoOrTimestamp) => {
  const d = toDateObj(isoOrTimestamp);
  if (!d) return '—';
  return d.toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

/** Format ISO/Firestore timestamp to time only */
export const formatTime = (isoOrTimestamp) => {
  const d = toDateObj(isoOrTimestamp);
  if (!d) return '—';
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
};

/** Format number with commas */
export const formatNumber = (n) =>
  n?.toLocaleString('en-IN') ?? '0';

/** Capitalize first letter */
export const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1) : '';

/** Format bytes to KB/MB */
export const formatBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
};

/** Format percentage */
export const formatPercent = (n) =>
  `${typeof n === 'number' ? n.toFixed(1) : '0'}%`;
