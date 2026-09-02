import { mockDevices, getDeviceById } from '../mock/mockDevices';
import { mockLabs }   from '../mock/mockLabs';
import { mockAlerts } from '../mock/mockAlerts';
import { mockHistory } from '../mock/mockHistory';
import { mockUsers }  from '../mock/mockUsers';
import { mockReports } from '../mock/mockReports';

/**
 * Data abstraction layer.
 * Phase 2: replace each function body with an API/Firestore call.
 * Components consume this layer via hooks — no changes needed in components.
 */

export const dataService = {
  // Devices
  getDevices:      ()       => Promise.resolve([...mockDevices]),
  getDeviceById:   (id)     => Promise.resolve(getDeviceById(id)),
  addDevice:       (device) => Promise.resolve({ ...device, id: `pc-${Date.now()}`, addedAt: new Date().toISOString() }),
  updateDevice:    (id, data) => Promise.resolve({ ...getDeviceById(id), ...data }),
  deleteDevice:    (id)     => Promise.resolve(id),

  // Labs
  getLabs:         ()       => Promise.resolve([...mockLabs]),
  getLabById:      (id)     => Promise.resolve(mockLabs.find((l) => l.id === id) ?? null),

  // Alerts
  getAlerts:       ()       => Promise.resolve([...mockAlerts]),
  getAlertsByDevice:(id)    => Promise.resolve(mockAlerts.filter((a) => a.device.toLowerCase() === id.toLowerCase())),

  // History
  getHistory:      ()       => Promise.resolve([...mockHistory]),
  getHistoryByDevice:(id)   => Promise.resolve(mockHistory.filter((h) => h.deviceId === id)),

  // Users
  getUsers:        ()       => Promise.resolve([...mockUsers]),

  // Reports
  getReports:      ()       => Promise.resolve({ ...mockReports }),
};
