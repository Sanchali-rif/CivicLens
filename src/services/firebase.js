// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCQkGdD940iYZY7RuCOODWpWTZI_VffB5E",
  authDomain: "civiclens-7302b.firebaseapp.com",
  projectId: "civiclens-7302b",
  storageBucket: "civiclens-7302b.firebasestorage.app",
  messagingSenderId: "408118755146",
  appId: "1:408118755146:web:328440bceecc6f22268bb3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export default app;