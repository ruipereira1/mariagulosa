// Firebase configuration for Vercel
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

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
  
  // Fallback seguro - apenas para desenvolvimento com variáveis locais
  if (process.env.NODE_ENV === 'development') {
    console.warn('⚠️ Firebase config missing. Please set environment variables.');
    console.warn('📖 See FIREBASE_CONFIG.md for setup instructions');
    
    // Verificar se há arquivo .env.local
    if (!firebaseConfig.apiKey) {
      throw new Error(`
🔥 Firebase Configuration Missing!

Please create a .env.local file with:
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

See FIREBASE_CONFIG.md for detailed instructions.
      `);
    }
  } else {
    // Em produção, exigir variáveis de ambiente
    if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
      throw new Error(`
🔥 Firebase Configuration Missing in Production!

Please configure environment variables in Vercel:
- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN  
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- NEXT_PUBLIC_FIREBASE_APP_ID

See FIREBASE_CONFIG.md for setup instructions.
      `);
    }
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
  // Removido: configuração de emulador não utilizada
  // if (process.env.NODE_ENV === 'development' && process.env.USE_FIREBASE_EMULATOR === 'true') {
  //   try {
  //     connectFirestoreEmulator(db, 'localhost', 8080);
  //     console.log('✅ Connected to Firestore emulator');
  //   } catch (error) {
  //     console.log('ℹ️ Emulador já conectado ou não disponível');
  //   }
  // }
} catch (error) {
  console.error('❌ Error initializing Firebase:', error);
  throw new Error(`Firebase initialization failed: ${error.message}`);
}

export { db };
export default app; 