/**
 * Data service layer.
 * All dummy/mock PC monitoring data has been removed.
 * Devices are managed directly via deviceService and Firestore.
 */

export const dataService = {
  // Devices
  getDevices: () => Promise.resolve([]),
  getDeviceById: () => Promise.resolve(null),
  addDevice: (d) => Promise.resolve(d),
  updateDevice: (id, data) => Promise.resolve({ id, ...data }),
  deleteDevice: (id) => Promise.resolve(id),

  // Labs
  getLabs: () => Promise.resolve([]),
  getLabById: () => Promise.resolve(null),

  // Alerts
  getAlerts: () => Promise.resolve([]),
  getAlertsByDevice: () => Promise.resolve([]),

  // History
  getHistory: () => Promise.resolve([]),
  getHistoryByDevice: () => Promise.resolve([]),

  // Users
  getUsers: () => Promise.resolve([]),

  // Reports
  getReports: () => Promise.resolve(null),
};
