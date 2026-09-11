import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { UserRole, ArmyOfficer } from '../types';

// Initialize Firebase App safely (singleton)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth
export const auth = getAuth(app);

// Initialize Google Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// Initialize Firestore with custom database ID specified in firebase-applet-config.json
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export interface FirestoreUserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  rank?: string;
  unit?: string;
  serviceNumber?: string;
  lastLogin: any;
}

/**
 * Sign in using Firebase Google Auth popup.
 * Persists the user profile to Firestore with the designated role.
 */
export async function signInWithGoogle(intendedRole: UserRole = 'army_officer'): Promise<{
  user: FirebaseUser;
  profile: FirestoreUserProfile;
}> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const fbUser = result.user;

    const userRef = doc(db, 'users', fbUser.uid);
    const existingSnap = await getDoc(userRef);

    let profile: FirestoreUserProfile;

    if (existingSnap.exists()) {
      const data = existingSnap.data() as FirestoreUserProfile;
      profile = {
        ...data,
        displayName: fbUser.displayName || data.displayName || 'Allied Officer',
        email: fbUser.email || data.email,
        photoURL: fbUser.photoURL || undefined,
        lastLogin: serverTimestamp(),
      };
      await setDoc(userRef, profile, { merge: true });
    } else {
      profile = {
        uid: fbUser.uid,
        email: fbUser.email || '',
        displayName: fbUser.displayName || (intendedRole === 'healthcare_officer' ? 'Dr. Medical Officer' : 'Capt. Army Officer'),
        photoURL: fbUser.photoURL || undefined,
        role: intendedRole,
        rank: intendedRole === 'healthcare_officer' ? 'Major (Medical)' : 'Captain',
        unit: intendedRole === 'healthcare_officer' ? 'Battalion Medical Corps' : '1st Rapid Reaction Battalion',
        serviceNumber: `MIL-${Math.floor(100000 + Math.random() * 900000)}`,
        lastLogin: serverTimestamp(),
      };
      await setDoc(userRef, profile);
    }

    return { user: fbUser, profile };
  } catch (error: any) {
    console.error('Firebase Google Sign-In error:', error);
    throw error;
  }
}

/**
 * Sign out from Firebase Auth
 */
export async function signOutUser(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Firebase Sign-Out error:', error);
  }
}

/**
 * Sync officer data to Firestore for cloud persistence
 */
export async function persistOfficerToFirestore(officer: ArmyOfficer): Promise<void> {
  try {
    const officerRef = doc(db, 'officers', officer.id);
    await setDoc(officerRef, {
      ...officer,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (err) {
    console.warn('Could not persist officer to Firestore:', err);
  }
}

/**
 * Fetch all officers from Firestore
 */
export async function fetchOfficersFromFirestore(): Promise<ArmyOfficer[]> {
  try {
    const querySnapshot = await getDocs(collection(db, 'officers'));
    const list: ArmyOfficer[] = [];
    querySnapshot.forEach((docSnap) => {
      list.push(docSnap.data() as ArmyOfficer);
    });
    return list;
  } catch (err) {
    console.warn('Could not fetch officers from Firestore:', err);
    return [];
  }
}
