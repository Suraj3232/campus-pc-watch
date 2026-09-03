import {
  doc,
  setDoc,
  updateDoc,
  getDoc,
  collection,
  onSnapshot,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';

export const DEVICE_ID_KEY = 'campusPcWatchDeviceId';

/**
 * Get or create a persistent device ID for this browser.
 */
export const getDeviceId = () => {
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);
  if (!deviceId) {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      deviceId = crypto.randomUUID();
    } else {
      deviceId = 'dev-' + Math.random().toString(36).substring(2, 11) + '-' + Date.now().toString(36);
    }
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }
  return deviceId;
};

/**
 * Derive a stable, clean device name from the device ID.
 * Example: PC-7F3A
 */
export const getDeviceName = (deviceId) => {
  const cleanId = (deviceId || '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  const suffix = cleanId.slice(-4) || '0001';
  return `PC-${suffix}`;
};

/**
 * Convert Firestore timestamp or ISO string into epoch ms.
 */
export const getMillis = (timestamp) => {
  if (!timestamp) return 0;
  if (typeof timestamp.toMillis === 'function') {
    try {
      const m = timestamp.toMillis();
      if (m) return m;
    } catch {
      // fallback
    }
  }
  if (typeof timestamp.toDate === 'function') {
    try {
      const d = timestamp.toDate();
      if (d) return d.getTime();
    } catch {
      // fallback
    }
  }
  if (typeof timestamp.seconds === 'number') {
    return timestamp.seconds * 1000 + Math.floor((timestamp.nanoseconds || 0) / 1000000);
  }
  if (timestamp instanceof Date) {
    return timestamp.getTime();
  }
  if (typeof timestamp === 'number') {
    return timestamp;
  }
  const parsed = new Date(timestamp).getTime();
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Determine if a device is online based on lastSeen age (<= 60 seconds).
 */
export const isDeviceOnline = (lastSeen, fallbackStatus) => {
  const ms = getMillis(lastSeen);
  if (!ms) {
    // If lastSeen timestamp is pending local cache resolution
    return fallbackStatus === 'online';
  }
  return Date.now() - ms <= 60000;
};

/**
 * Compute the effective display status of a device.
 */
export const resolveDeviceStatus = (device) => {
  if (!device) return 'offline';
  return isDeviceOnline(device.lastSeen, device.status) ? 'online' : 'offline';
};

/**
 * Register or update the current browser device in Firestore.
 */
export const registerDevice = async (user) => {
  if (!user || !user.uid) return null;

  const deviceId = getDeviceId();
  const deviceName = getDeviceName(deviceId);
  const deviceRef = doc(db, 'devices', deviceId);

  try {
    const snap = await getDoc(deviceRef);
    if (!snap.exists()) {
      await setDoc(deviceRef, {
        deviceId,
        userId: user.uid,
        userEmail: user.email || '',
        deviceName,
        status: 'online',
        labId: null,
        labName: null,
        ipAddress: null,
        lastSeen: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } else {
      await updateDoc(deviceRef, {
        userId: user.uid,
        userEmail: user.email || '',
        status: 'online',
        lastSeen: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
    return deviceId;
  } catch (error) {
    console.error('[deviceService] Failed to register device:', error);
    throw error;
  }
};

/**
 * Send heartbeat update to Firestore for the current browser device.
 */
export const updateHeartbeat = async (deviceId) => {
  if (!deviceId) return;
  const deviceRef = doc(db, 'devices', deviceId);
  try {
    await updateDoc(deviceRef, {
      status: 'online',
      lastSeen: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('[deviceService] Heartbeat update failed:', error);
  }
};

/**
 * Graceful attempt to set device offline on logout.
 */
export const setDeviceOffline = async (deviceId) => {
  if (!deviceId) return;
  const deviceRef = doc(db, 'devices', deviceId);
  try {
    await updateDoc(deviceRef, {
      status: 'offline',
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    // Non-fatal, offline status will be determined naturally by lastSeen timeout
    console.warn('[deviceService] Setting offline on logout failed (safe to ignore):', error);
  }
};

/**
 * Subscribe to all devices in Firestore (Admin real-time listener).
 */
export const subscribeToDevices = (onUpdate, onError) => {
  const devicesRef = collection(db, 'devices');
  return onSnapshot(
    devicesRef,
    (snapshot) => {
      const list = [];
      snapshot.forEach((d) => {
        const data = d.data();
        list.push({
          id: d.id,
          ...data,
          // name and ip fallbacks for table display
          name: data.deviceName || getDeviceName(d.id),
          ip: data.ipAddress || 'Not available',
          lab: data.labName || 'Not Assigned',
        });
      });
      onUpdate(list);
    },
    (err) => {
      console.error('[deviceService] subscribeToDevices error:', err);
      if (onError) onError(err);
    }
  );
};

/**
 * Subscribe to devices belonging to a specific user.
 */
export const subscribeToMyDevice = (userId, onUpdate, onError) => {
  if (!userId) {
    onUpdate([]);
    return () => {};
  }
  const q = query(collection(db, 'devices'), where('userId', '==', userId));
  return onSnapshot(
    q,
    (snapshot) => {
      const list = [];
      snapshot.forEach((d) => {
        const data = d.data();
        list.push({
          id: d.id,
          ...data,
          name: data.deviceName || getDeviceName(d.id),
          ip: data.ipAddress || 'Not available',
          lab: data.labName || 'Not Assigned',
        });
      });
      onUpdate(list);
    },
    (err) => {
      console.error('[deviceService] subscribeToMyDevice error:', err);
      if (onError) onError(err);
    }
  );
};
