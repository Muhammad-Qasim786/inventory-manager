// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDJv_7QENfm562Ih01YJlGrJZrTzz_nojc",
  authDomain: "pantry-tracker-ec689.firebaseapp.com",
  projectId: "pantry-tracker-ec689",
  storageBucket: "pantry-tracker-ec689.appspot.com",
  messagingSenderId: "32972445417",
  appId: "1:32972445417:web:3d4a3cec7ec5eb13364278",
  measurementId: "G-SG14JP6282"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}