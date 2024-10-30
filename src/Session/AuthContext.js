import { createContext, useEffect, useContext, useState } from 'react';
import { auth } from './firebase.js'

const AuthContext = createContext({
    user: null,
    userName: null
})

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [userName, setUserName] = useState(null)

    useEffect(() => {
        return auth.onIdTokenChanged(async (user) => {
            if (!user) {
                console.log("Missing user");
                setUser(null);
            }
            else {
                const token = await user.getIdToken();
                setUser(user);
                setUserName(user.email.replace("@gmail.com", ""))
                localStorage.setItem("token", token);
                console.log("AuthProvider\Token")
                console.log(token);
            }
        })
    }, []);

    useEffect(() => {
        const handle = setInterval(async () => {
            const user = auth.currentUser;
            if (user) {
                console.log("refresh token")
                await user.getIdToken(true);
                console.log(user);
            }

        }, 10 * 60 * 1000);
        return () => clearInterval(handle);
    }, []);

    return (
        <AuthContext.Provider value={{ user, userName }}>{children}</AuthContext.Provider>
    )
}
export const useAuth = () => {
    return useContext(AuthContext);
};