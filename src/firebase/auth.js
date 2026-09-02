import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';

/** Sign in an existing user */
export const signIn = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

/** Register a new user, create Firestore doc with role */
export const signUp = async (email, password, displayName) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName });

  // Store in Firestore with role = 'user' by default
  await setDoc(doc(db, 'users', cred.user.uid), {
    uid:        cred.user.uid,
    email,
    displayName,
    role:       'user',
    status:     'active',
    createdAt:  serverTimestamp(),
  });

  return cred;
};

/** Sign out */
export const signOut = () => firebaseSignOut(auth);

/** Send password reset email */
export const sendPasswordReset = (email) =>
  sendPasswordResetEmail(auth, email);

/** Get current Firebase user */
export const getCurrentUser = () => auth.currentUser;

/** Subscribe to auth state changes */
export const onAuthStateChange = (callback) =>
  onAuthStateChanged(auth, callback);

/** Fetch user role from Firestore */
export const getUserRole = async (uid) => {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) return snap.data().role ?? 'user';
    return 'user';
  } catch {
    return 'user';
  }
};

/** Map Firebase error codes to human-readable messages */
export const getAuthErrorMessage = (code) => {
  const map = {
    'auth/user-not-found':      'No account found with this email address.',
    'auth/wrong-password':      'Incorrect password. Please try again.',
    'auth/email-already-in-use':'This email is already registered.',
    'auth/weak-password':       'Password must be at least 6 characters.',
    'auth/invalid-email':       'Please enter a valid email address.',
    'auth/too-many-requests':   'Too many attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Check your connection.',
    'auth/invalid-credential':  'Invalid email or password.',
  };
  return map[code] ?? 'An unexpected error occurred. Please try again.';
};
