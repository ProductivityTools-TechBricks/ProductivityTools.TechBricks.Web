import { Link } from 'react-router-dom'

function ShortcutItemNew() {


    const addShortcut = () => {
        console.log("add");
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