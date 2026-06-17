// ───────────────────────────────────────────────────────────────
// Firebase DESCONECTADO en esta web.
//
// La web funciona 100% estática: todo el contenido está integrado
// en el código y NO se conecta a ninguna base de datos.
//
// ¿Quieres un panel de administración propio?
// 1. Crea un proyecto nuevo en https://console.firebase.google.com
// 2. Sustituye los valores de abajo por las credenciales de ese proyecto.
// 3. Reactiva la lectura de datos en src/hooks/useCollection.ts
// ───────────────────────────────────────────────────────────────
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'DISABLED',
  authDomain: 'agencia.example.com',
  projectId: 'agencia-disabled',
  storageBucket: 'agencia-disabled.appspot.com',
  messagingSenderId: '000000000000',
  appId: '1:000000000000:web:0000000000000000000000',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
