// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAMAX7XIlmww3MhvmP0ZLuHxOEurKxmVaQ",
  authDomain: "map-80886.firebaseapp.com",
  projectId: "map-80886",
  storageBucket: "map-80886.appspot.com",
  messagingSenderId: "674291802029",
  appId: "1:674291802029:web:75e14d20d00eb873a74b24",
  measurementId: "G-BC3GMESTP6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
