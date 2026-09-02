const now = Date.now();
const mins = (m) => new Date(now - m * 60 * 1000).toISOString();
const hrs  = (h) => new Date(now - h * 60 * 60 * 1000).toISOString();

const statusMix = (i) => {
  if (i % 17 === 0) return 'offline';
  if (i % 11 === 0) return 'warning';
  return 'online';
};

const buildPCs = (prefix, start, count, labId, labName) =>
  Array.from({ length: count }, (_, idx) => {
    const num    = String(start + idx).padStart(3, '0');
    const id     = `${prefix}-${num}`;
    const status = statusMix(start + idx);
    return {
      id,
      name:        id.toUpperCase(),
      ip:          `192.168.${labId}.${10 + idx}`,
      lab:         labName,
      labId,
      status,
      lastSeen:    status === 'online' ? mins(Math.floor(Math.random() * 5))
                 : status === 'warning' ? mins(15 + Math.floor(Math.random() * 30))
                 : hrs(1 + Math.floor(Math.random() * 5)),
      description: `${labName} workstation ${num}`,
      addedAt:     hrs(24 * (30 + idx)),
      cpu:         status === 'online' ? Math.floor(Math.random() * 60 + 10) : null,
      ram:         status === 'online' ? Math.floor(Math.random() * 50 + 20) : null,
      os:          'Windows 11 Pro',
    };
  });

export const mockDevices = [
  ...buildPCs('pc',  1,   25, 1, 'Computer Lab 1'),
  ...buildPCs('pc',  26,  30, 2, 'Computer Lab 2'),
  ...buildPCs('pc',  56,  45, 3, 'Computer Lab 3'),
  ...buildPCs('srv', 1,    5, 4, 'Server Room'),
];

export const getDeviceById = (id) =>
  mockDevices.find((d) => d.id === id) ?? null;
