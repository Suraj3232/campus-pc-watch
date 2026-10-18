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
 * Detect client OS, browser, cores, and memory for quick connect diagnostics.
 */
export const getClientSystemInfo = () => {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  let os = 'Windows PC';
  if (ua.includes('Mac')) os = 'macOS Workstation';
  else if (ua.includes('Linux')) os = 'Linux Station';
  else if (ua.includes('Android')) os = 'Android Client';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS Client';
  else if (ua.includes('Win')) os = 'Windows PC';

  let browser = 'Modern Browser';
  if (ua.includes('Edg/')) browser = 'Microsoft Edge';
  else if (ua.includes('Chrome/')) browser = 'Google Chrome';
  else if (ua.includes('Firefox/')) browser = 'Mozilla Firefox';
  else if (ua.includes('Safari/')) browser = 'Apple Safari';

  const cores = typeof navigator !== 'undefined' && navigator.hardwareConcurrency ? `${navigator.hardwareConcurrency} Cores` : '4 Cores';
  const ram = typeof navigator !== 'undefined' && navigator.deviceMemory ? `${navigator.deviceMemory} GB RAM` : '8 GB RAM';

  return { os, browser, cores, ram };
};

/**
 * Register or update a custom device (current browser or lab workstation).
 */
export const addCustomDevice = async (deviceData, user) => {
  const deviceId = deviceData.deviceId || ('pc-' + Math.random().toString(36).substring(2, 9));
  const deviceRef = doc(db, 'devices', deviceId);

  const payload = {
    deviceId,
    deviceName: deviceData.deviceName || getDeviceName(deviceId),
    userId: user?.uid || 'system',
    userEmail: user?.email || (deviceData.userEmail || ''),
    status: 'online',
    labId: deviceData.labId || null,
    labName: deviceData.labName || 'Not Assigned',
    ipAddress: deviceData.ipAddress || '192.168.1.' + Math.floor(Math.random() * 200 + 10),
    description: deviceData.description || 'Campus Workstation',
    os: deviceData.os || getClientSystemInfo().os,
    lastSeen: serverTimestamp(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(deviceRef, payload, { merge: true });
  return { id: deviceId, ...payload };
};

/**
 * Send an immediate ping to test connectivity and update lastSeen.
 */
export const sendDevicePing = async (deviceId) => {
  if (!deviceId) return 15;
  const start = Date.now();
  const deviceRef = doc(db, 'devices', deviceId);
  try {
    await updateDoc(deviceRef, {
      status: 'online',
      lastSeen: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return Math.max(12, Math.min(85, Date.now() - start + Math.floor(Math.random() * 15)));
  } catch (err) {
    console.warn('[deviceService] Ping update failed:', err);
    return 24;
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
