// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    query,
    where,
    Timestamp,
    doc,
    setDoc,
    getDoc
  } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

  // Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyBkEGZj64ouHw6YRcZd9c60TrIIcDiGHEo",
  authDomain: "dbzgym-ebf2d.firebaseapp.com",
  projectId: "dbzgym-ebf2d",
  storageBucket: "dbzgym-ebf2d.firebasestorage.app",
  messagingSenderId: "506543258175",
  appId: "1:506543258175:web:c2b101c1604b36a6b6168a",
};

export { initializeApp, getFirestore, collection, addDoc, getDocs, query, where, Timestamp, doc, setDoc, getDoc };

