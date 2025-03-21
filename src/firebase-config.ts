import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// Replace these values with your Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyBx0J-7e9mH0vkKSbRUcxMhZcsXB4R0xX4",
    authDomain: "bbc-db-2b51c.firebaseapp.com",
    databaseURL: "https://bbc-db-2b51c-default-rtdb.firebaseio.com",
    projectId: "bbc-db-2b51c",
    storageBucket: "bbc-db-2b51c.firebasestorage.app",
    messagingSenderId: "77284998973",
    appId: "1:77284998973:web:93841dba0eae859bc68f54",
    measurementId: "G-0JN0C2PDDE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 