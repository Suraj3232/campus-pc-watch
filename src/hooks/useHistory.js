import { useState } from 'react';

/**
 * Real History hook.
 * Returns empty array until real history persistence is implemented.
 * Mock history removed completely.
 */
export const useHistory = () => {
  const [history] = useState([]);
  const [loading] = useState(false);
  const [error] = useState(null);

  return { history, loading, error };
};
