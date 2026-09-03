import { useState, useEffect } from 'react';
import { subscribeToMyDevice, resolveDeviceStatus } from '../services/deviceService';
import { useAuth } from '../auth/AuthContext';

export const useMyDevice = () => {
  const { user } = useAuth();
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [, setTick] = useState(0);

  useEffect(() => {
    if (!user || !user.uid) {
      setDevices([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToMyDevice(
      user.uid,
      (list) => {
        setDevices(list);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  // Local timer every 5 seconds to re-calculate online/offline status locally without Firestore writes
  useEffect(() => {
    const timer = setInterval(() => {
      setTick((t) => t + 1);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const processedDevices = devices.map((d) => ({
    ...d,
    status: resolveDeviceStatus(d),
  }));

  const primaryDevice = processedDevices[0] || null;

  return {
    device: primaryDevice,
    devices: processedDevices,
    loading,
    error,
  };
};
