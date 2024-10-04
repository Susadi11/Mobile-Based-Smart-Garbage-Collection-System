import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"; // Import Firebase Storage
import { getDatabase } from "firebase/database"; // Import Firebase Realtime Database

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyD6kZgT6H_p5yXVrTEZTwmQ1clXr-xQ3h8",
  authDomain: "smart-garbage-app-cdd59.firebaseapp.com",
  projectId: "smart-garbage-app-cdd59",
  storageBucket: "smart-garbage-app-cdd59.appspot.com", // Ensure this matches your Firebase Storage bucket name
  messagingSenderId: "764348005985",
  appId: "1:764348005985:web:3b95775005bfc6bb9b7420",
  measurementId: "G-PDCJXE3S9H",
  databaseURL: "https://smart-garbage-app-cdd59-default-rtdb.asia-southeast1.firebasedatabase.app/" // Add Realtime Database URL
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Auth
const auth = getAuth(app);

// Initialize Storage
const storage = getStorage(app); // Initialize Firebase Storage

// Initialize Realtime Database
const database = getDatabase(app); // Initialize Firebase Realtime Database

// Export the initialized app and services
export { app, db, auth, storage, database  };
