import axios from 'axios'
import { config } from '../Consts'
import { auth } from "../Session/firebase"

async function invokeCall(user, call) {
    const header = {
        headers: { Authorization: `Bearer ${user.accessToken}` }
    }
    const response = call(header);
    return response;
}

async function addPallet(user, data) {

    let payload = {
        name: data
    }

    let call = async (header) => {
        const response = await axios.post(`${config.PATH_BASE}\pallet`, payload, header)
        return response.data;
    }

    return invokeCall(user, call);

    // let brick = {
    //     name: "Office"
    // }
}

async function addBrick(user, data) {
    const header = {
        headers: { Authorization: `Bearer ${user.accessToken}` }
    }
    // let brick = {
    //     name: "Office"
    // }
    const response = await axios.post(`${config.PATH_BASE}\Brick`, data, header)
}


async function getShortcuts(user) {

    //let accessToken=localStorage.getItem("Bearer");
    const header = {
        //headers:{Authorization: `Bearer ${auth.currentUser.accessToken}`}
        //headers:{Authorization: `Bearer ${accessToken}`}
        headers: { Authorization: `Bearer ${user.accessToken}` }
    }

    const response = await axios.get(`${config.PATH_BASE}\Card`, header);
    //const response = await axios.get(`${config.PATH_BASE}\Card`);
    return response.data;
}

async function addShortuct(user, shortuct) {
    const header = {
        headers: { Authorization: `Bearer ${user.accessToken}` }
    }
    const response = await axios.post(`${config.PATH_BASE}\Card`, shortuct, header)
    return response.data;
}



export {
    addPallet,
    getShortcuts,
    addShortuct,
    addBrick
} 