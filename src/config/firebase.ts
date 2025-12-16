import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Warn about missing env vars in non-production for easier debugging
const missing = [
  !import.meta.env.VITE_FIREBASE_API_KEY && 'VITE_FIREBASE_API_KEY',
  !import.meta.env.VITE_FIREBASE_AUTH_DOMAIN && 'VITE_FIREBASE_AUTH_DOMAIN',
  !import.meta.env.VITE_FIREBASE_PROJECT_ID && 'VITE_FIREBASE_PROJECT_ID',
  !import.meta.env.VITE_FIREBASE_STORAGE_BUCKET && 'VITE_FIREBASE_STORAGE_BUCKET',
  !import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID && 'VITE_FIREBASE_MESSAGING_SENDER_ID',
  !import.meta.env.VITE_FIREBASE_APP_ID && 'VITE_FIREBASE_APP_ID'
].filter(Boolean);
if (missing.length && import.meta.env.MODE !== 'production') {
  // eslint-disable-next-line no-console
  console.warn(`Missing Firebase env vars: ${missing.join(', ')}. Create a .env file or configure them in your deploy provider.`);
}

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export default app;