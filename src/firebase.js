// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Replace the below config with your actual Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyDxODnA6NLiwhNYw-9HZdYb3Qq-p6l_Ylw",
  authDomain: "news-699ae.firebaseapp.com",
  projectId: "news-699ae",
  storageBucket: "news-699ae.firebasestorage.app",
  messagingSenderId: "62878955840",
  appId: "1:62878955840:web:a5e662b22a43a4efafa2a5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
