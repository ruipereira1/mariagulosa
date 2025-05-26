// Firebase configuration for Vercel
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// Firebase config usando variáveis de ambiente
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID || process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Validação de configuração obrigatória
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('❌ Firebase configuration is missing. Please check your environment variables.');
  console.error('Available env vars:', Object.keys(process.env).filter(key => key.includes('FIREBASE')));
  
  // Fallback para desenvolvimento local (temporário)
  if (process.env.NODE_ENV === 'development') {
    console.warn('⚠️ Using fallback Firebase config for development');
    firebaseConfig.apiKey = firebaseConfig.apiKey || "AIzaSyCRyLCgUClshxZqQ3ZTRHx-6j26ucwVoRs";
    firebaseConfig.authDomain = firebaseConfig.authDomain || "maria-gulosa-b460f.firebaseapp.com";
    firebaseConfig.projectId = firebaseConfig.projectId || "maria-gulosa-b460f";
    firebaseConfig.storageBucket = firebaseConfig.storageBucket || "maria-gulosa-b460f.firebasestorage.app";
    firebaseConfig.messagingSenderId = firebaseConfig.messagingSenderId || "373372889835";
    firebaseConfig.appId = firebaseConfig.appId || "1:373372889835:web:0577d99b04c94e75112cae";
  } else {
    // Em produção, usar configuração padrão se não houver variáveis de ambiente
    console.warn('⚠️ Using fallback Firebase config for production');
    firebaseConfig.apiKey = firebaseConfig.apiKey || "AIzaSyCRyLCgUClshxZqQ3ZTRHx-6j26ucwVoRs";
    firebaseConfig.authDomain = firebaseConfig.authDomain || "maria-gulosa-b460f.firebaseapp.com";
    firebaseConfig.projectId = firebaseConfig.projectId || "maria-gulosa-b460f";
    firebaseConfig.storageBucket = firebaseConfig.storageBucket || "maria-gulosa-b460f.firebasestorage.app";
    firebaseConfig.messagingSenderId = firebaseConfig.messagingSenderId || "373372889835";
    firebaseConfig.appId = firebaseConfig.appId || "1:373372889835:web:0577d99b04c94e75112cae";
  }
}

// Initialize Firebase (evitar múltiplas inicializações)
let app;
let db;

try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    console.log('✅ Firebase app initialized successfully');
  } else {
    app = getApps()[0];
    console.log('✅ Firebase app already initialized');
  }

  // Initialize Firestore
  db = getFirestore(app);
  console.log('✅ Firestore initialized successfully');

  // Conectar ao emulador em desenvolvimento (opcional)
  if (process.env.NODE_ENV === 'development' && process.env.USE_FIREBASE_EMULATOR === 'true') {
    try {
      connectFirestoreEmulator(db, 'localhost', 8080);
      console.log('✅ Connected to Firestore emulator');
    } catch (error) {
      console.log('ℹ️ Emulador já conectado ou não disponível');
    }
  }
} catch (error) {
  console.error('❌ Error initializing Firebase:', error);
  throw new Error(`Firebase initialization failed: ${error.message}`);
}

export { db };
export default app; 