import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'

import * as apiService from '../../services/apiService'
import { useAuth } from '../../Session/AuthContext'
import Bricks from './Bricks.js'

function PalletItemNew() {

    const { user } = useAuth();
    const [pallet, setPallet] = useState(null);
    const [owners, setOwners] = useState([]);
   // const [bricks, setBricks] = useState([{ 'key': 'get-costam', 'value': 'render' }])


    useEffect(() => {
        setOwners([user.email])
    }, [])

    const addPallet = () => {
        console.log("addPellet")
        apiService.addPallet(user, pallet, owners);
    }

    const pelletNameChange = (e) => {
        setPallet(e.target.value)
    }



    return (
        <div>
            <Link to="/bricks">Bricks</Link>
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
            <button onClick={addPallet}>Add Pellet</button>

        </div>
    )
}

export default PalletItemNew