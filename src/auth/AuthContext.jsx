import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signIn,
  signUp,
  signOut,
  sendPasswordReset,
  onAuthStateChange,
  getUserRole,
} from '../firebase/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user,     setUser]     = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const role = await getUserRole(firebaseUser.uid);
        setUserRole(role);
      } else {
        setUser(null);
        setUserRole(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = (email, password) => signIn(email, password);

  const register = (email, password, displayName) =>
    signUp(email, password, displayName);

  const logout = () => signOut();

  const resetPassword = (email) => sendPasswordReset(email);

  const isAdmin = userRole === 'admin';

  return (
    <AuthContext.Provider
      value={{ user, userRole, loading, isAdmin, login, register, logout, resetPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
