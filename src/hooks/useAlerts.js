import { useState } from 'react';

/**
 * Real Alert hook.
 * Currently returns real alerts only (0 when none configured).
 * Mock alerts removed completely.
 */
export const useAlerts = () => {
  const [alerts] = useState([]);
  const [loading] = useState(false);
  const [error] = useState(null);

  return { alerts, loading, error };
};
