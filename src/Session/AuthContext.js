import { createContext, useEffect, useContext, useState } from 'react';
import { auth } from './firebase.js'
import statusService from '../services/statusService'

const AuthContext = createContext({
    user: null,
    userName: null,
    loading: true,
    tokenRefreshTime: null,
    refreshToken: async () => { },
})

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [userName, setUserName] = useState(null)
    const [loading, setLoading] = useState(true)
    const [tokenRefreshTime, setTokenRefreshTime] = useState(null)

    useEffect(() => {
        // Fires on sign-in, sign-out and every ID token refresh. The token
        // itself is not stored anywhere by the app - apiService asks Firebase
        // for a fresh one before every request (see firebase.js getIdToken).
        return auth.onIdTokenChanged((user) => {
            if (!user) {
                console.log("Missing user");
                setUser(null);
                setUserName(null);
                setTokenRefreshTime(null);
            }
            else {
                setUser(user);
                setUserName(user.email.replace("@gmail.com", ""))
                setTokenRefreshTime(new Date());
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
                auth.currentUser.getIdToken().catch((err) => {
                    console.error("Token refresh failed", err);
                    statusService.error("Token refresh failed");
                });
            }
        };
        document.addEventListener('visibilitychange', onVisible);
        return () => document.removeEventListener('visibilitychange', onVisible);
    }, []);

    // Forces a new ID token (button in the status bar).
    const refreshToken = async () => {
        if (auth.currentUser) {
            await auth.currentUser.getIdToken(true);
        }
    };

    return (
        <AuthContext.Provider value={{ user, userName, loading, tokenRefreshTime, refreshToken }}>{children}</AuthContext.Provider>
    )
}
export const useAuth = () => {
    return useContext(AuthContext);
};
