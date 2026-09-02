const now = Date.now();
const mins = (m) => new Date(now - m * 60 * 1000).toISOString();
const hrs  = (h) => new Date(now - h * 60 * 60 * 1000).toISOString();

const events = [
  { status: 'online',  msg: 'Device came online' },
  { status: 'offline', msg: 'Device went offline' },
  { status: 'warning', msg: 'High latency detected' },
  { status: 'online',  msg: 'Reconnected after timeout' },
  { status: 'warning', msg: 'Packet loss detected' },
];

const deviceIds = [
  'pc-001','pc-005','pc-011','pc-017','pc-022','pc-028','pc-033',
  'pc-044','pc-054','pc-056','pc-066','pc-077','pc-083','pc-091',
  'srv-001','srv-002',
];

let id = 1;
export const mockHistory = [];

deviceIds.forEach((deviceId) => {
  const labId   = deviceId.startsWith('srv') ? 4 : parseInt(deviceId.replace('pc-','')) <= 25 ? 1 : parseInt(deviceId.replace('pc-','')) <= 55 ? 2 : 3;
  const labName = { 1:'Computer Lab 1', 2:'Computer Lab 2', 3:'Computer Lab 3', 4:'Server Room' }[labId];

  for (let h = 23; h >= 0; h -= 2) {
    const ev = events[Math.floor(Math.random() * events.length)];
    mockHistory.push({
      id:         `h${id++}`,
      deviceId,
      device:     deviceId.toUpperCase(),
      lab:        labName,
      labId,
      status:     ev.status,
      message:    ev.msg,
      timestamp:  hrs(h + Math.random()),
      duration:   `${Math.floor(Math.random() * 55 + 5)}m`,
    });
  }
});

// Sort newest first
mockHistory.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
