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

async function addPallet(user, palletName, palletOwners) {

    let payload = {
        name: palletName,
        owners: palletOwners,
        bricks: []
    }

    let call = async (header) => {
        const response = await axios.put(`${config.PATH_BASE}pallet`, payload, header)
        return response.data;
    }

    return invokeCall(user, call);
}

async function updatePallet(user, pallet) {
    let call = async (header) => {
        const response = await axios.post(`${config.PATH_BASE}pallet`, pallet, header)
        return response.data;
    }
    return invokeCall(user, call);
}

async function addBrick(user, data) {
    const header = {
        headers: { Authorization: `Bearer ${user.accessToken}` }
    }
    const response = await axios.post(`${config.PATH_BASE}brick`, data, header)
}



async function getPallets(user,queryowner) {
    console.log(user);
    let data = {
        owner: queryowner
    }
    let call = async (header) => {
        const response = await axios.get(`${config.PATH_BASE}pallet`, { params: data  }, header);
        return response.data;
    }
    return invokeCall(user, call)
}

async function getShortcuts(user) {

    //let accessToken=localStorage.getItem("Bearer");
    const header = {
        //headers:{Authorization: `Bearer ${auth.currentUser.accessToken}`}
        //headers:{Authorization: `Bearer ${accessToken}`}
        headers: { Authorization: `Bearer ${user.accessToken}` }
    }

    const response = await axios.get(`${config.PATH_BASE}card`, header);
    //const response = await axios.get(`${config.PATH_BASE}\Card`);
    return response.data;
}

async function addShortuct(user, shortuct) {
    const header = {
        headers: { Authorization: `Bearer ${user.accessToken}` }
    }
    const response = await axios.post(`${config.PATH_BASE}card`, shortuct, header)
    return response.data;
}



export {
    addPallet,
    updatePallet,
    getPallets,
    getShortcuts,
    addShortuct,
    addBrick
} 