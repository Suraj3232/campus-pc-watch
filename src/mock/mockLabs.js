import { mockDevices } from './mockDevices';

const countByLab = (labId, status) =>
  mockDevices.filter((d) => d.labId === labId && d.status === status).length;

export const mockLabs = [
  {
    id:          1,
    name:        'Computer Lab 1',
    location:    'Block A, Ground Floor',
    description: 'Primary undergraduate computing lab with 25 workstations.',
    totalPCs:    25,
    online:      countByLab(1, 'online'),
    offline:     countByLab(1, 'offline'),
    warning:     countByLab(1, 'warning'),
    category:    'Teaching',
  },
  {
    id:          2,
    name:        'Computer Lab 2',
    location:    'Block A, First Floor',
    description: 'Advanced computing lab for postgraduate students.',
    totalPCs:    30,
    online:      countByLab(2, 'online'),
    offline:     countByLab(2, 'offline'),
    warning:     countByLab(2, 'warning'),
    category:    'Teaching',
  },
  {
    id:          3,
    name:        'Computer Lab 3',
    location:    'Block B, Ground Floor',
    description: 'General purpose lab shared by all departments.',
    totalPCs:    45,
    online:      countByLab(3, 'online'),
    offline:     countByLab(3, 'offline'),
    warning:     countByLab(3, 'warning'),
    category:    'General',
  },
  {
    id:          4,
    name:        'Server Room',
    location:    'Block C, Basement',
    description: 'Central server infrastructure and network equipment.',
    totalPCs:    5,
    online:      countByLab(4, 'online'),
    offline:     countByLab(4, 'offline'),
    warning:     countByLab(4, 'warning'),
    category:    'Infrastructure',
  },
];
