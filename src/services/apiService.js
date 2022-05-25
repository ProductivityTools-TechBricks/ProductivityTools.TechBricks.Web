import axios from 'axios'
import { config } from '../Consts'
import {auth} from "../Session/firebase"


async function getShortcuts() {

    let accessToken=localStorage.getItem("Bearer");
    debugger;
    const header={
        //headers:{Authorization: `Bearer ${auth.currentUser.accessToken}`}
        headers:{Authorization: `Bearer ${accessToken}`}
    }

    const response = await axios.get(`${config.PATH_BASE}\Card`,header);
   //const response = await axios.get(`${config.PATH_BASE}\Card`);
    return response.data;
}

export{
    getShortcuts
} 