// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCYQ6-u31bk2P2fAIM8_FoKzYa-K7rnc5Q",
  authDomain: "er-raus-a8e25.firebaseapp.com",
  projectId: "er-raus-a8e25",
  storageBucket: "er-raus-a8e25.appspot.com",
  messagingSenderId: "2987290768",
  appId: "1:2987290768:web:f5993e4af8215b92572815",
  measurementId: "G-0Z07KCRH6S"
};


// // Initialize Firebase
export const app = initializeApp(firebaseConfig);

// // Initialize services
// const db = getFirestore(app);
// const auth = getAuth(app);

// Export the services
export {  firebaseConfig };