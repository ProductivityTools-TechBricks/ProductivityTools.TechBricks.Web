import { Link } from 'react-router-dom'
import * as apiService from '../../services/apiService'
import {useAuth} from '../../Session/AuthContext'

function BricktemNew() {
    const { user } = useAuth();


    const addShortcut = () => {
        console.log("add");
        let data = {
            name:'Word',
            data:[{
                key:'CRTL+z',
                value:'Undo'
            },{
                key:'CRTL+Y',
                value:'Redo'
            }]
        }
        //apiService.addShortuct(user, data);
        apiService.addBrick(user,data);
    }

    return (
        <div>
            <Link to="/home">Home</Link>
            <Link to="/bricks">Shortcuts</Link>
            <p>New shortuct item</p>
            <p>
                <span>shortuct</span>
                <input type="text" name="name"></input>
            </p>
            <p>
                <span>explanation</span>
                <input type="text" name="name"></input>
            </p>
            <button onClick={addShortcut}>Add</button>
            <span>dsafa</span>
        </div>)
}
export default BricktemNew