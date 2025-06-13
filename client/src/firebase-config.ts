// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_AUTH_API_KEY,
    authDomain: import.meta.env.VITE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_AUTH_PROJECTID,
    storageBucket: import.meta.env.VITE_AUTH_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_AUTH_MESSAGING_SENDERID,
    appId: import.meta.env.VITE_AUTH_APPID,
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);