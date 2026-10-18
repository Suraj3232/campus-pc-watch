import { useState, useEffect, useCallback } from 'react';
import {
  subscribeToDevices,
  resolveDeviceStatus,
  addCustomDevice,
} from '../services/deviceService';
import { doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const useDevices = () => {
  const [rawDevices, setRawDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [, setTick] = useState(0);

  // Subscribe to real-time Firestore device updates
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToDevices(
      (list) => {
        setRawDevices(list);
        setLoading(false);
        setError(null);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Requirement 9: Lightweight local timer every 5 seconds
  // Recalculates online/offline from lastSeen locally without writing to Firestore.
  useEffect(() => {
    const timer = setInterval(() => {
      setTick((t) => t + 1);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Compute effective online/offline status based on 60s lastSeen threshold
  const devices = rawDevices.map((d) => ({
    ...d,
    status: resolveDeviceStatus(d),
  }));

  const refetch = useCallback(() => {
    // onSnapshot is already continuous and real-time; trigger state refresh
    setTick((t) => t + 1);
  }, []);

  const addDevice = async (deviceData, user) => {
    return await addCustomDevice(deviceData, user);
  };

  const updateDevice = async (id, data) => {
    const deviceRef = doc(db, 'devices', id);
    await updateDoc(deviceRef, data);
  };

  const deleteDevice = async (id) => {
    const deviceRef = doc(db, 'devices', id);
    await deleteDoc(deviceRef);
  };

  return {
    devices,
    loading,
    error,
    refetch,
    addDevice,
    updateDevice,
    deleteDevice,
  };
};
