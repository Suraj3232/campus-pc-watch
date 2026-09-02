import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth';

import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';

import { auth, db } from './config';


// ==========================================
// SIGN IN
// ==========================================

export const signIn = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);


// ==========================================
// REGISTER
// ==========================================

export const signUp = async (email, password, displayName) => {

  // 1. Create Firebase Authentication account
  const cred = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  try {

    // 2. Update Firebase Auth profile
    await updateProfile(cred.user, {
      displayName,
    });

    // 3. Create Firestore user document
    await setDoc(
      doc(db, 'users', cred.user.uid),
      {
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: displayName,
        role: 'user',
        status: 'active',
        createdAt: serverTimestamp(),
      }
    );

    return cred;

  } catch (error) {

    console.error(
      'Firestore user profile creation failed:',
      error
    );

    throw error;
  }
};


// ==========================================
// SIGN OUT
// ==========================================

export const signOut = () =>
  firebaseSignOut(auth);


// ==========================================
// PASSWORD RESET
// ==========================================

export const sendPasswordReset = (email) =>
  sendPasswordResetEmail(auth, email);


// ==========================================
// CURRENT USER
// ==========================================

export const getCurrentUser = () =>
  auth.currentUser;


// ==========================================
// AUTH STATE
// ==========================================

export const onAuthStateChange = (callback) =>
  onAuthStateChanged(auth, callback);


// ==========================================
// GET USER ROLE
// ==========================================

export const getUserRole = async (uid) => {

  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);

  if (snap.exists()) {
    return snap.data().role || 'user';
  }

  return 'user';
};


// ==========================================
// AUTH ERROR MESSAGES
// ==========================================

export const getAuthErrorMessage = (code) => {

  const map = {

    'auth/user-not-found':
      'No account found with this email address.',

    'auth/wrong-password':
      'Incorrect password. Please try again.',

    'auth/email-already-in-use':
      'This email is already registered.',

    'auth/weak-password':
      'Password must be at least 6 characters.',

    'auth/invalid-email':
      'Please enter a valid email address.',

    'auth/too-many-requests':
      'Too many attempts. Please try again later.',

    'auth/network-request-failed':
      'Network error. Check your connection.',

    'auth/invalid-credential':
      'Invalid email or password.',

    'auth/operation-not-allowed':
      'Email/Password authentication is not enabled in Firebase.',

    'permission-denied':
      'Firebase denied access to Firestore. Check your Firestore rules.',

    'failed-precondition':
      'Firestore is not configured correctly.',

    'unavailable':
      'Firebase is temporarily unavailable. Please try again.',

  };

  return (
    map[code] ||
    'Firebase error: ' + code
  );
};