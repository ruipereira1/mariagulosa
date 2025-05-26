// Firebase configuration for Vercel API Routes
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Firebase config usando variáveis de ambiente
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSyCRyLCgUClshxZqQ3ZTRHx-6j26ucwVoRs",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "maria-gulosa-b460f.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID || "maria-gulosa-b460f",
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || "maria-gulosa-b460f.firebasestorage.app",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "373372889835",
  appId: process.env.FIREBASE_APP_ID || "1:373372889835:web:0577d99b04c94e75112cae"
};

// Initialize Firebase (evitar múltiplas inicializações)
let app;
let db;

try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    console.log('✅ Firebase app initialized for API');
  } else {
    app = getApps()[0];
    console.log('✅ Firebase app already initialized');
  }

  // Initialize Firestore
  db = getFirestore(app);
  console.log('✅ Firestore initialized for API');
} catch (error) {
  console.error('❌ Error initializing Firebase for API:', error);
  db = null;
}

export { db };
export default app; 