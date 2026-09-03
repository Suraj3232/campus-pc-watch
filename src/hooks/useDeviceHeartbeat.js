import { useEffect, useRef } from 'react';
import {
  getDeviceId,
  registerDevice,
  updateHeartbeat,
} from '../services/deviceService';

const HEARTBEAT_INTERVAL_MS = 20000; // 20 seconds

export const useDeviceHeartbeat = (user) => {
  const intervalRef = useRef(null);
  const isRegisteredRef = useRef(false);

  useEffect(() => {
    if (!user || !user.uid) {
      // Cleanup if user logged out
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      isRegisteredRef.current = false;
      return;
    }

    const deviceId = getDeviceId();

    // Register device upon successful login/mount
    const initDevicePresence = async () => {
      try {
        await registerDevice(user);
        isRegisteredRef.current = true;
      } catch (err) {
        console.error('[useDeviceHeartbeat] Initial device registration failed:', err);
      }
    };

    initDevicePresence();

    // Clear any existing interval to ensure strict uniqueness
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Set 20-second heartbeat interval
    intervalRef.current = setInterval(async () => {
      try {
        await updateHeartbeat(deviceId);
      } catch (err) {
        console.error('[useDeviceHeartbeat] Heartbeat pulse failed:', err);
      }
    }, HEARTBEAT_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [user?.uid]);
};
