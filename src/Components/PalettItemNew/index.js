import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'

import { getUserName } from '../../Tools/usertools'

import * as apiService from '../../services/apiService'
import { useAuth } from '../../Session/AuthContext'

function PalletItemNew() {

    const navigate = useNavigate();
    const { user } = useAuth();
    const [pallet, setPallet] = useState(null);
    const [owners, setOwners] = useState([]);
    const auth = useAuth();


    useEffect(() => {
        setOwners([getUserName()])
    }, [])




    const addPallet = async () => {
        console.log("addPellet")
        await apiService.addPallet(user, pallet, owners);
        console.log("authuser", auth.userName);
        var link="/"+auth.userName;
        navigate(link);


    }

    const pelletNameChange = (e) => {
        setPallet(e.target.value)
    }



    return (
        <div>
            <Link to="/{getUserName()}">List</Link>
            <p>Name:</p>
            <input type="text" onChange={pelletNameChange}></input>
            <p>Owners:</p>
            <ul>
                {owners.map((item) => {
                    return (<li>{item}</li>)
                })}
            </ul>
            {/* <p>Bricks:</p>
            <Bricks bricks={bricks} setBricks={setBricks}></Bricks> */}
            <hr></hr>
            <button onClick={addPallet}>Add Pallet</button>

        </div>
    )
}

export default PalletItemNew