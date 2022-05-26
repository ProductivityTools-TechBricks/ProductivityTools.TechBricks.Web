import {Link} from 'react-router-dom'

function ShortcutItemNew() {
    return (
        <div>
            <Link to="/home">Home</Link>
            <Link to="/shortcuts">Shortcuts</Link>
            <p>New shortuct item</p>
        </div>)
}
export default ShortcutItemNew