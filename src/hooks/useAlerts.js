import { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';

export const useAlerts = () => {
  const [alerts,  setAlerts]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    dataService.getAlerts()
      .then(setAlerts)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { alerts, loading, error };
};
