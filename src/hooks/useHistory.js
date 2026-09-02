import { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';

export const useHistory = (deviceId = null) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    const fn = deviceId
      ? dataService.getHistoryByDevice(deviceId)
      : dataService.getHistory();
    fn
      .then(setHistory)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [deviceId]);

  return { history, loading, error };
};
