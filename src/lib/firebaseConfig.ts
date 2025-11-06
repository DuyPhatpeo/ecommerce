// firebase.ts
import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDU2GAdQVwHtxCjI67Y_lbg68C88qnL35g",
  authDomain: "ecommerce-dino.firebaseapp.com",
  projectId: "ecommerce-dino",
  storageBucket: "ecommerce-dino.firebasestorage.app",
  messagingSenderId: "764526390067",
  appId: "1:764526390067:web:b104c2147436b329246c46",
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

// Export Firebase services with type safety
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);

export default app;
