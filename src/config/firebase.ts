import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

// TODO: Add SDKs for  products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCnQ9EXY7NtvSvkE2qXpwspfr3Gq7tFWr0",
    authDomain: "app-sce.firebaseapp.com",
    projectId: "app-sce",
    storageBucket: "app-sce.firebasestorage.app",
    messagingSenderId: "611002242733",
    appId: "1:611002242733:web:4a9d80b9ab758ab5495824"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {persistence: getReactNativePersistence(AsyncStorage)});
export const db = getFirestore(app);