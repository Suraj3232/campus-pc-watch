import { useState } from 'react';

/**
 * Real Labs hook.
 * Returns empty array until Firestore labs management is implemented.
 * Mock labs removed completely.
 */
export const useLabs = () => {
  const [labs] = useState([]);
  const [loading] = useState(false);
  const [error] = useState(null);

  return { labs, loading, error };
};
