// Aggregated statistics for charts and report tables
export const mockReports = {
  // Lab-wise availability %
  labAvailability: [
    { lab: 'Lab 1', availability: 92, total: 25, online: 23, offline: 2 },
    { lab: 'Lab 2', availability: 90, total: 30, online: 27, offline: 3 },
    { lab: 'Lab 3', availability: 89, total: 45, online: 40, offline: 5 },
    { lab: 'Server Room', availability: 100, total: 5, online: 5, offline: 0 },
  ],

  // Device online count over last 7 days
  weeklyOnline: [
    { day: 'Mon', online: 91, offline: 9  },
    { day: 'Tue', online: 88, offline: 12 },
    { day: 'Wed', online: 93, offline: 7  },
    { day: 'Thu', online: 90, offline: 10 },
    { day: 'Fri', online: 87, offline: 13 },
    { day: 'Sat', online: 75, offline: 25 },
    { day: 'Sun', online: 70, offline: 30 },
  ],

  // Alert frequency per day
  alertFrequency: [
    { day: 'Mon', high: 2, warning: 3, info: 4 },
    { day: 'Tue', high: 1, warning: 2, info: 6 },
    { day: 'Wed', high: 3, warning: 1, info: 3 },
    { day: 'Thu', high: 0, warning: 4, info: 2 },
    { day: 'Fri', high: 2, warning: 3, info: 5 },
    { day: 'Sat', high: 1, warning: 1, info: 1 },
    { day: 'Sun', high: 0, warning: 0, info: 2 },
  ],

  // Summary stats
  summary: {
    totalPCs:         100,
    avgUptime:        90.3,
    totalAlerts:      20,
    resolvedAlerts:   17,
    activeAlerts:     3,
    peakOnline:       95,
    peakOnlineDay:    'Wednesday',
    lowestOnline:     70,
    lowestOnlineDay:  'Sunday',
  },
};
