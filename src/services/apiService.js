import axios from 'axios'
import { config } from '../Consts'
import { getIdToken } from "../Session/firebase"

async function buildHeader(forceRefresh) {
    const token = await getIdToken(forceRefresh);
    return { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', } }
}

async function invokeCall(user, call) {
    // Always ask Firebase for the current ID token - it is refreshed
    // automatically from the long-lived refresh token when it has expired.
    try {
        return await call(await buildHeader(false));
    } catch (err) {
        // The token may have been revoked or expired in between (e.g. clock
        // skew, laptop sleep). Force a refresh and retry exactly once.
        if (err?.response?.status === 401) {
            console.log("401 from API - forcing token refresh and retrying");
            return await call(await buildHeader(true));
        }
        throw err;
    }
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
        console.log("updatePallet: header", header)
        console.log("updatePallet: pallet", pallet);
        //const response = await axios.post(`${config.PATH_BASE}pallet`, pallet, header)
        const response = await axios.post(`${config.PATH_BASE}pallet`, pallet, header)
        return response.data;
    }
    return invokeCall(user, call);
}

async function removePellet(user, pallet) {
    let call = async (header) => {

        const payload = { data: pallet }
        console.log("removePellet: header", header)
        console.log("removePellet: payload", payload)

        const response = await axios.delete(`${config.PATH_BASE}pallet`, { data: payload.data, headers: header.headers })
        return response.data;
    }
    return invokeCall(user, call);
}

async function addBrick(user, data) {
    const header = {
        headers: {
            Authorization: `Bearer ${user.accessToken}`,

        }
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
        const response = await axios.get(`${config.PATH_BASE}pallet`, { params: data, headers: header.headers });
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
async function renamePallet(user, palletId, newName) {
    let call = async (header) => {
        const payload = { document_id: palletId, name: newName }
        console.log("renamePallet: header", header)
        console.log("renamePallet: payload", payload)
        const response = await axios.patch(`${config.PATH_BASE}pallet`, payload, header)
        return response.data;
    }
    return invokeCall(user, call);
}

async function moveBrick(user, sourcePalletId, targetPalletId, brickId) {
    let call = async (header) => {
        const payload = {
            source_pallet_id: sourcePalletId,
            target_pallet_id: targetPalletId,
            brick_id: brickId
        };
        const response = await axios.patch(`${config.PATH_BASE}Brick`, payload, header);
        return response.data;
    }
    return invokeCall(user, call);
}


export {
    addPallet,
    updatePallet,
    getPallets,
    removePellet,
    renamePallet,
    moveBrick,
    //   getShortcuts,
    //addShortuct,
    //  addBrick
} 