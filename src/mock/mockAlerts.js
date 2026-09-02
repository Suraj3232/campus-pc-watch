const now = Date.now();
const mins = (m) => new Date(now - m * 60 * 1000).toISOString();
const hrs  = (h) => new Date(now - h * 60 * 60 * 1000).toISOString();

export const mockAlerts = [
  { id: 'a1',  severity: 'HIGH',    device: 'PC-017', lab: 'Computer Lab 1', labId: 1, message: 'Device went offline unexpectedly',            timestamp: mins(5),    resolved: false },
  { id: 'a2',  severity: 'HIGH',    device: 'PC-033', lab: 'Computer Lab 2', labId: 2, message: 'Connection timeout — no ping response',       timestamp: mins(12),   resolved: false },
  { id: 'a3',  severity: 'WARNING', device: 'PC-011', lab: 'Computer Lab 1', labId: 1, message: 'High latency detected (>200ms)',               timestamp: mins(28),   resolved: false },
  { id: 'a4',  severity: 'HIGH',    device: 'PC-056', lab: 'Computer Lab 3', labId: 3, message: 'Device unreachable for 60 minutes',            timestamp: hrs(1),     resolved: false },
  { id: 'a5',  severity: 'INFO',    device: 'PC-005', lab: 'Computer Lab 1', labId: 1, message: 'Device restarted — back online',               timestamp: hrs(1.5),   resolved: true  },
  { id: 'a6',  severity: 'WARNING', device: 'PC-044', lab: 'Computer Lab 2', labId: 2, message: 'Intermittent connectivity — packet loss 15%', timestamp: hrs(2),     resolved: true  },
  { id: 'a7',  severity: 'INFO',    device: 'SRV-002',lab: 'Server Room',    labId: 4, message: 'Scheduled maintenance window completed',       timestamp: hrs(3),     resolved: true  },
  { id: 'a8',  severity: 'HIGH',    device: 'PC-077', lab: 'Computer Lab 3', labId: 3, message: 'Device offline — last seen 4 hours ago',       timestamp: hrs(4),     resolved: true  },
  { id: 'a9',  severity: 'WARNING', device: 'PC-028', lab: 'Computer Lab 2', labId: 2, message: 'CPU usage spike detected (>90%)',              timestamp: hrs(5),     resolved: true  },
  { id: 'a10', severity: 'INFO',    device: 'PC-013', lab: 'Computer Lab 1', labId: 1, message: 'New device detected on network',               timestamp: hrs(6),     resolved: true  },
  { id: 'a11', severity: 'HIGH',    device: 'PC-091', lab: 'Computer Lab 3', labId: 3, message: 'Multiple failed ping attempts',                timestamp: hrs(7),     resolved: true  },
  { id: 'a12', severity: 'WARNING', device: 'PC-022', lab: 'Computer Lab 1', labId: 1, message: 'Unusually low response time variance',         timestamp: hrs(8),     resolved: true  },
  { id: 'a13', severity: 'INFO',    device: 'SRV-001',lab: 'Server Room',    labId: 4, message: 'Network switch rebooted successfully',          timestamp: hrs(10),    resolved: true  },
  { id: 'a14', severity: 'HIGH',    device: 'PC-066', lab: 'Computer Lab 3', labId: 3, message: 'Device offline for >2 hours',                  timestamp: hrs(12),    resolved: true  },
  { id: 'a15', severity: 'WARNING', device: 'PC-038', lab: 'Computer Lab 2', labId: 2, message: 'RAM usage critical (>85%)',                    timestamp: hrs(14),    resolved: true  },
  { id: 'a16', severity: 'INFO',    device: 'PC-001', lab: 'Computer Lab 1', labId: 1, message: 'Device came online after maintenance',         timestamp: hrs(16),    resolved: true  },
  { id: 'a17', severity: 'HIGH',    device: 'PC-054', lab: 'Computer Lab 2', labId: 2, message: 'ARP conflict detected',                        timestamp: hrs(18),    resolved: true  },
  { id: 'a18', severity: 'WARNING', device: 'PC-083', lab: 'Computer Lab 3', labId: 3, message: 'Disk I/O errors reported',                     timestamp: hrs(20),    resolved: true  },
  { id: 'a19', severity: 'INFO',    device: 'SRV-003',lab: 'Server Room',    labId: 4, message: 'Backup completed successfully',                 timestamp: hrs(22),    resolved: true  },
  { id: 'a20', severity: 'WARNING', device: 'PC-019', lab: 'Computer Lab 1', labId: 1, message: 'Network cable disconnect detected',            timestamp: hrs(24),    resolved: true  },
];
