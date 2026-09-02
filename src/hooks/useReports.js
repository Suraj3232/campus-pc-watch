import { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';

export const useReports = () => {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    dataService.getReports()
      .then(setReports)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { reports, loading, error };
};
