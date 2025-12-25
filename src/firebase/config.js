import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Configuração do Firebase usando variáveis de ambiente
// Para desenvolvimento local, crie um arquivo .env na raiz do projeto
// Para produção (Vercel), configure as variáveis no painel da Vercel

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "SUA_API_KEY_AQUI",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "seu-projeto.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "seu-projeto-id",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "seu-projeto.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "seu-app-id"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
export const db = getFirestore(app);

export default app;
