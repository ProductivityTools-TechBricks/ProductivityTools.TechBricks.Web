import { Link } from 'react-router-dom'
import * as apiService from '../../services/apiService'
import {useAuth} from '../../Session/AuthContext'

function ShortcutItemNew() {
    const { user } = useAuth();


    const addShortcut = () => {
        console.log("add");
        let data = {
            xx:'fdsa'
        }
        apiService.addShortuct(user, data);
    }

    return (
        <div>
            <Link to="/home">Home</Link>
            <Link to="/shortcuts">Shortcuts</Link>
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
export default ShortcutItemNew