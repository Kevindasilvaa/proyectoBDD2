// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {} from "firebase/storage";
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { FacebookAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAvLPNpSNKkhrxGKEygSqiDVmRTwxJuCZc",
  authDomain: "pruebabdd-e41ab.firebaseapp.com",
  projectId: "pruebabdd-e41ab",
  storageBucket: "pruebabdd-e41ab.firebasestorage.app",
  messagingSenderId: "433482092988",
  appId: "1:433482092988:web:bbfb3b342177da16441bb9"
};

// Initialize Firebase
// export const app = initializeApp(firebaseConfig);
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();