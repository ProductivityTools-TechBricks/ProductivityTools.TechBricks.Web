import axios from 'axios'
import { config } from '../Consts'


async function getShortcuts() {
    const response = await axios.get(`${config.PATH_BASE}\Card`);
    return response.data;
}

export{
    getShortcuts
} 