import * as apiService from '../../services/apiService'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ShortuctItem from '../ShortcutItem'

function ShortcutList() {
    const [shortucts, setShortucts] = useState([])
    const [selectedCategory, setSelectedCategory] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            console.log("fetch data")
            const r = await apiService.getShortcuts();
            if (r != null) {
                setShortucts(r);
                console.log(r);
            }
        }
        fetchData();
    }, []);


    const categoryClick = (e, documentId) => {
        console.log(e);
        let x = shortucts.find(x => x.document_id == documentId);
        console.log(x);
        setSelectedCategory(x);
    }

    return (
        <div>
            <span>ShortcutList</span>
            <Link to="/home">Home</Link>
            <Link to="shortuct/new">New</Link>
            <p>{shortucts.map(x => {
                return (<p><Link to="#" onClick={(e) => categoryClick(e, x.document_id)} >{x.name} - {x.document_id}</Link></p>)
            })}</p>
            <p>
                {selectedCategory && selectedCategory.data && selectedCategory.data.map(x => { return (<ShortuctItem data={x}></ShortuctItem>) })}
            </p>
            <p>X</p>
            <p>X</p>
            <p>X</p>
            <p>{JSON.stringify(shortucts, null, 2)}</p>
        </div>
    )
}

export default ShortcutList;