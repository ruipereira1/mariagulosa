// Firebase configuration for Vercel
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

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
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Firestore
const db = getFirestore(app);

// Conectar ao emulador em desenvolvimento (opcional)
if (process.env.NODE_ENV === 'development' && process.env.USE_FIREBASE_EMULATOR === 'true') {
  try {
    connectFirestoreEmulator(db, 'localhost', 8080);
  } catch (error) {
    console.log('Emulador já conectado ou não disponível');
  }
}

export { db };
export default app; 