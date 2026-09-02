import { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';

export const useLabs = () => {
  const [labs,    setLabs]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    dataService.getLabs()
      .then(setLabs)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return { labs, loading, error };
};
