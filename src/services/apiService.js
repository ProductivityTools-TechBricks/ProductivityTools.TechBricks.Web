import axios from 'axios'
import { config } from '../Consts'
import {auth} from "../Session/firebase"


async function getShortcuts() {

    const header={
        headers:{Authorization: `Bearer ${auth.currentUser.accessToken}`}
    }

    const response = await axios.get(`${config.PATH_BASE}\Card`,header);
   //const response = await axios.get(`${config.PATH_BASE}\Card`);
    return response.data;
}

export{
    getShortcuts
} 