import { initializeApp } from "firebase/app";

import {
    GoogleAuthProvider,
    browserLocalPersistence,
    getAuth,
    onAuthStateChanged,
    setPersistence,
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

// Long-living session: Firebase keeps a long-lived refresh token in the
// browser (IndexedDB) and mints short-lived (1h) ID tokens from it on demand.
// With local persistence the user stays signed in across tabs, reloads and
// browser restarts until an explicit logout.
const persistenceReady = setPersistence(auth, browserLocalPersistence)
    .catch((err) => console.error("Unable to set auth persistence", err));

// Resolves once Firebase has restored the persisted session (or determined
// there is none). Without waiting for this, auth.currentUser is null right
// after a page reload even though the user is signed in.
const authReady = persistenceReady.then(() => new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        resolve(user);
    });
}));

// Returns a valid ID token for the signed-in user, or null when signed out.
// getIdToken() returns the cached token and transparently refreshes it when
// it is expired or about to expire, so callers never send a stale token.
const getIdToken = async (forceRefresh = false) => {
    await authReady;
    const user = auth.currentUser;
    if (!user) {
        return null;
    }
    return user.getIdToken(forceRefresh);
};

const googleProvider = new GoogleAuthProvider();
const signInWithGoogle = async () => {
    try {
        await persistenceReady;
        const res = await signInWithPopup(auth, googleProvider);
        console.log(res);
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
};

const logout = async () => {
    await signOut(auth);
    // Cleanup of the token stored by older versions of the app.
    localStorage.removeItem("token")
};


export {
    auth,
    authReady,
    getIdToken,
    signInWithGoogle,
    logout,
};
