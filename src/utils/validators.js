export const validators = {
  required: (val) => val?.trim() ? null : 'This field is required.',

  email: (val) => {
    if (!val?.trim()) return 'Email is required.';
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(val) ? null : 'Please enter a valid email address.';
  },

  password: (val) => {
    if (!val) return 'Password is required.';
    if (val.length < 6) return 'Password must be at least 6 characters.';
    return null;
  },

  confirmPassword: (val, original) => {
    if (!val) return 'Please confirm your password.';
    if (val !== original) return 'Passwords do not match.';
    return null;
  },

  displayName: (val) => {
    if (!val?.trim()) return 'Name is required.';
    if (val.trim().length < 2) return 'Name must be at least 2 characters.';
    return null;
  },

  ipAddress: (val) => {
    if (!val?.trim()) return 'IP address is required.';
    const re = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!re.test(val)) return 'Enter a valid IP address (e.g. 192.168.1.10).';
    return null;
  },

  deviceName: (val) => {
    if (!val?.trim()) return 'Device name is required.';
    if (val.trim().length < 2) return 'Device name must be at least 2 characters.';
    return null;
  },
};
