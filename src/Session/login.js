import { useEffect } from "react";
import { useNavigate } from "react-router-dom"
import {auth, signInWithGoogle } from "./firebase"
import {useAuthState} from "react-firebase-hooks/auth"

export default function Login(){

    const [user,loading]=useAuthState(auth);
    const navigate=useNavigate();

    useEffect(()=>{
        if(loading){
            return;
        }
        if(user){
            navigate("/home");
        }
    },[user,loading,navigate])

    return(
        <div className="login">
            <div className="login__container">
                <button className="login__btn login__google" onClick={signInWithGoogle}>
                    Login with Google
                </button>
            </div>
        </div>
    )
}