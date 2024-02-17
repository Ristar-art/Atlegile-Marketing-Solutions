// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
// import "firebase/compat/firestore";
import "firebase/compat/storage";
import "firebase/compat/firestore";
import { getFirestore, doc } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// import firebase from 'firebase/app';
import "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCcMJua3yDxzzTOweyKZJO0cNhb0ffPYmk",
  authDomain: "atlegile-marketing-solutions.firebaseapp.com",
  projectId: "atlegile-marketing-solutions",
  storageBucket: "atlegile-marketing-solutions.appspot.com",
  messagingSenderId: "184474823085",
  appId: "1:184474823085:web:a3bef82b0ea4218b445924",
  measurementId: "G-M4DZHH66ZS",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
// const app = initializeApp(firebaseConfig);
const auth = firebase.auth();
const firestore = firebase.firestore();
// const storage = firebase.storage();

export const db = getFirestore();
const storage = firebase.storage();

// export const storage = getStorage();
export { doc };

export { firebase, auth, firestore, storage };

// export default app;
export default firebaseConfig;
