// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCkOTiKvBfGs-IG4cRkDNC0uYWlcKKPrqs",
  authDomain: "airflix-2a0c0.firebaseapp.com",
  projectId: "airflix-2a0c0",
  storageBucket: "airflix-2a0c0.appspot.com",
  messagingSenderId: "1045544359311",
  appId: "1:1045544359311:web:8d5767f2a511bb6c7227fa",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
