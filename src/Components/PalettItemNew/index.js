import * as apiService from '../../services/apiService'
import {useAuth} from '../../Session/AuthContext'

function PalletItemNew() {

    const { user } = useAuth();

    const addPallet=()=>{
        console.log("addPellet")
        apiService.addPallet(user, "fsda");
    }


    return (
        <div>
            <p>Name:</p>
            <input type="text"></input>
            <button  onClick={addPallet}>Add</button>
            
        </div>
    )
}

export default PalletItemNew