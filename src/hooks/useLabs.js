import { useMemo } from 'react';
import { useDevices } from './useDevices';
import { mockLabs } from '../mock/mockLabs';

export const useLabs = () => {
  const { devices, loading, error } = useDevices();

  const labs = useMemo(() => {
    return mockLabs.map((lab) => {
      const labDevices = devices.filter(
        (d) => String(d.labId) === String(lab.id) || d.lab === lab.name || d.labName === lab.name
      );
      const online = labDevices.filter((d) => d.status === 'online').length;
      const offline = labDevices.filter((d) => d.status === 'offline').length;
      const total = Math.max(lab.totalPCs, labDevices.length);

      return {
        ...lab,
        totalPCs: total,
        online: labDevices.length > 0 ? online : lab.online,
        offline: labDevices.length > 0 ? offline : lab.offline,
      };
    });
  }, [devices]);

  return { labs, loading, error };
};
