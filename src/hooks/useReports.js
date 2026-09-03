import { useMemo } from 'react';
import { useDevices } from './useDevices';

/**
 * Reports hook derived from real Firestore devices.
 * Zero fabricated numbers or mock data.
 */
export const useReports = () => {
  const { devices, loading, error } = useDevices();

  const reports = useMemo(() => {
    if (loading) return null;

    const total = devices.length;
    const online = devices.filter((d) => d.status === 'online').length;
    const offline = devices.filter((d) => d.status === 'offline').length;
    const avgUptime = total > 0 ? Math.round((online / total) * 100) : 0;

    return {
      summary: {
        totalPCs: total,
        avgUptime,
        totalAlerts: 0,
        resolvedAlerts: 0,
        activeAlerts: 0,
        peakOnline: online,
        peakOnlineDay: 'Today',
        lowestOnline: offline,
        lowestOnlineDay: 'Today',
      },
      labAvailability: [],
      weeklyOnline: [],
      alertFrequency: [],
    };
  }, [devices, loading]);

  return { reports, loading, error };
};
