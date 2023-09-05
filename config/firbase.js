// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAYRHbWC-rdL3kp4zoFdaq7yVtbjihx4uo",
  authDomain: "promptcreator360.firebaseapp.com",
  databaseURL: "https://promptcreator360-default-rtdb.firebaseio.com",
  projectId: "promptcreator360",
  storageBucket: "promptcreator360.appspot.com",
  messagingSenderId: "101189196820",
  appId: "1:101189196820:web:e2e2f7245b8f19b8fcdb01",
  measurementId: "G-B0VNQS5NF9",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const firestore = getFirestore(app);
export const auth = getAuth(app);
