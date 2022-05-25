import { initializeApp } from "firebase/app";

import {
    GoogleAuthProvider,
    getAuth,
    signInWithPopup,
    signOut,
} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAr0HCAH_e80NeivpRm7PJls50O0sX2Y18",
    authDomain: "pttechbricksapi-347809.firebaseapp.com",
    projectId: "pttechbricksapi-347809",
    storageBucket: "pttechbricksapi-347809.appspot.com",
    messagingSenderId: "209178581855",
    appId: "1:209178581855:web:3b4141de71f0f6634a74ea"
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async () => {
    try {
        debugger;
        const res = await signInWithPopup(auth, googleProvider);
        console.log(res);
        localStorage.setItem("Bearer",res.user.accessToken)
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
};

const logout = () => {
    signOut(auth);
    
};


export {
    auth,
    signInWithGoogle,
    logout,
};