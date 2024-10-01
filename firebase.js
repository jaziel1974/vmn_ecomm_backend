import { initializeApp } from "firebase/app";
import {getStorage} from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyBgP79iYiHNtgPJtMjv_la_yFU4D7A1dH8",
  authDomain: "loja-verdemusgonatural.firebaseapp.com",
  projectId: "loja-verdemusgonatural",
  storageBucket: "loja-verdemusgonatural.appspot.com",
  messagingSenderId: "350990544506",
  appId: "1:350990544506:web:9fffbbe8b7df9b19cd55c3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);