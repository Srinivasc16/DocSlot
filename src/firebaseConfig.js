// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore'; // For Firestore
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAMI4tDYXhy6YSQ9PXlzF3hzTahwjxQrxw",
    authDomain: "docslot-6dd1e.firebaseapp.com",
    projectId: "docslot-6dd1e",
    storageBucket: "docslot-6dd1e.firebasestorage.app",
    messagingSenderId: "722289383954",
    appId: "1:722289383954:web:fc5742e1c91b34980596cb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

const auth = getAuth(app);

export { auth, db };