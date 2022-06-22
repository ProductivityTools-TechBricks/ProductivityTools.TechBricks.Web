import axios from 'axios'
import { config } from '../Consts'
import { auth } from "../Session/firebase"

async function invokeCall(user, call) {

    let token = localStorage.getItem('token')
    console.log("token from localstorage", token)
    const header = { headers: { Authorization: `Bearer ${token}` } }
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
        console.log("addPallet")
        console.log(header);
        const response = await axios.put(`${config.PATH_BASE}pallet`, payload, header)
        return response.data;
    }

    return invokeCall(user, call);
}

async function updatePallet(user, pallet) {
    let call = async (header) => {
        console.log("updatePallet")
        console.log(header);
        console.log("pallet");
        console.log(pallet);

        //const response = await axios.post(`${config.PATH_BASE}pallet`, pallet, header)
        const response = await axios.post(`${config.PATH_BASE}pallet`, pallet, header )
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



async function getPallets(user, queryowner) {
    console.log(user);
    let data = {
        owner: queryowner
    }
    let call = async (header) => {

        //const response = await axios.get(`${config.PATH_BASE}pallet`, { params: data  }, header);
        // debugger;
        const response = await axios.get(`${config.PATH_BASE}pallet`, { params: data, headers: header });
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
    //   getShortcuts,
    //addShortuct,
    //  addBrick
} 