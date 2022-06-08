
import { auth, logout } from "../Session/firebase"

function getUserName() {
    console.log("getusername")
    if (auth != null && auth.currentUser != null) {
        let login = '/'+auth.currentUser.email.replace('@gmail.com', '');
        console.log("retunr", login)
        return login;
    }
    else {
        console.log("return xxx")
        return 'xxx'
    }

}


export {
    getUserName,

} 