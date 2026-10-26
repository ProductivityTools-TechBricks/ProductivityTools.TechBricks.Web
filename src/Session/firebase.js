import { initializeApp } from "firebase/app";

import {
    GoogleAuthProvider,
    getAuth,
    signInWithPopup,
    signOut,
} from "firebase/auth";

const devfirebaseConfig = {
    apiKey: "AIzaSyAr0HCAH_e80NeivpRm7PJls50O0sX2Y18",
    authDomain: "pttechbricksapi-347809.firebaseapp.com",
    projectId: "pttechbricksapi-347809",
    storageBucket: "pttechbricksapi-347809.appspot.com",
    messagingSenderId: "209178581855",
    appId: "1:209178581855:web:3b4141de71f0f6634a74ea"
};

const prodfirebaseConfig = {
  apiKey: "AIzaSyAxmnZm4597RcMVQeJrby3HpuDfzYyTJoU",
  authDomain: "ptprojectsweb.firebaseapp.com",
  projectId: "ptprojectsweb",
  storageBucket: "ptprojectsweb.firebasestorage.app",
  messagingSenderId: "93484780890",
  appId: "1:93484780890:web:a9e5766ce07eeee79ff763"
};


// Initialize Firebase
const configName=process.env.NODE_ENV === 'development' ? devfirebaseConfig : prodfirebaseConfig;
const app = initializeApp(configName);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async () => {
    try {
        const res = await signInWithPopup(auth, googleProvider);
        console.log(res);
        localStorage.setItem("token", res.user.accessToken);

        console.log("token validation");
        let token = localStorage.getItem('token');
        console.log("token from localstorage", token);
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
};

const logout = () => {
    signOut(auth);
    localStorage.removeItem("token")
};


export {
    auth,
    signInWithGoogle,
    logout,
};