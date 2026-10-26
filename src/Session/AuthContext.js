import { createContext, useEffect, useContext, useState } from 'react';
import { auth } from './firebase.js'

const AuthContext = createContext({
    user: null,
    userName: null,
    loading: true
})

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [userName, setUserName] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Fires on sign-in, sign-out and every ID token refresh. The token
        // itself is not stored anywhere by the app - apiService asks Firebase
        // for a fresh one before every request (see firebase.js getIdToken).
        return auth.onIdTokenChanged((user) => {
            if (!user) {
                console.log("Missing user");
                setUser(null);
                setUserName(null);
            }
            else {
                setUser(user);
                setUserName(user.email.replace("@gmail.com", ""))
            }
            setLoading(false);
        })
    }, []);

    useEffect(() => {
        // Timers are throttled/suspended in background tabs and while the
        // machine sleeps, so when the user comes back make sure the session
        // is refreshed proactively (getIdToken only hits the network if the
        // token is expired or close to expiry).
        const onVisible = () => {
            if (document.visibilityState === 'visible' && auth.currentUser) {
                auth.currentUser.getIdToken().catch((err) => console.error("Token refresh failed", err));
            }
        };
        document.addEventListener('visibilitychange', onVisible);
        return () => document.removeEventListener('visibilitychange', onVisible);
    }, []);

    return (
        <AuthContext.Provider value={{ user, userName, loading }}>{children}</AuthContext.Provider>
    )
}
export const useAuth = () => {
    return useContext(AuthContext);
};
