import { useState, useEffect } from 'react';
import { dataService } from '../services/dataService';

export const useDevices = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const fetch = async () => {
    try {
      setLoading(true);
      const data = await dataService.getDevices();
      setDevices(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const addDevice    = async (d)       => { const nd = await dataService.addDevice(d);        setDevices((p) => [...p, nd]); return nd; };
  const updateDevice = async (id, d)   => { const ud = await dataService.updateDevice(id, d); setDevices((p) => p.map((x) => x.id === id ? ud : x)); return ud; };
  const deleteDevice = async (id)      => { await dataService.deleteDevice(id);               setDevices((p) => p.filter((x) => x.id !== id)); };

  return { devices, loading, error, refetch: fetch, addDevice, updateDevice, deleteDevice };
};
