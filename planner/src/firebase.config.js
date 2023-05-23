import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCMrFZfIT2N4iFuKPrpRmRbwRHKldT5534",
    authDomain: "csduck-24ba1.firebaseapp.com",
    projectId: "csduck-24ba1",
    storageBucket: "csduck-24ba1.appspot.com",
    messagingSenderId: "724400202088",
    appId: "1:724400202088:web:fe78ddac3e52ac2634f6dd",
    measurementId: "G-ZYS4MBVE7L"
  };

const app = initializeApp(firebaseConfig);
const authentication = getAuth(app);

export default authentication;