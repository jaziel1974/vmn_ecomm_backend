// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDIeloz-QinQptGieCdIc2cWSn0t-G_Fn4",
  authDomain: "react-ecommerce-a479e.firebaseapp.com",
  projectId: "react-ecommerce-a479e",
  storageBucket: "react-ecommerce-a479e.appspot.com",
  messagingSenderId: "292442078664",
  appId: "1:292442078664:web:8b8376200f4af18f0894fd",
  measurementId: "G-9GV9BT4GR2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);