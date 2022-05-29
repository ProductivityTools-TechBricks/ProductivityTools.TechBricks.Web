import * as apiService from '../../services/apiService'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DictItem from '../DictItem'
import { useAuth } from '../../Session/AuthContext.js'


function DictList() {
    const [dict, setDict] = useState([])
    const [selectedCategory, setSelectedCategory] = useState([])

    const { user } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            console.log("fetch data")
            const r = await apiService.getShortcuts(user);
            if (r != null) {
                setDict(r);
                console.log(r);
            }
        }
        fetchData();
    }, []);


    const categoryClick = (e, documentId) => {
        console.log(e);
        let x = dict.find(x => x.document_id == documentId);
        console.log(x);
        setSelectedCategory(x);
    }

    return (
        <div>
            <span>DictList</span>
            <Link to="/home">Home</Link>
            <Link to="/shortcuts/new">New</Link>
            <p>{dict.map(x => {
                return (<p><Link to="#" onClick={(e) => categoryClick(e, x.document_id)} >{x.name} - {x.document_id}</Link></p>)
            })}</p>
            <p>
                {selectedCategory && selectedCategory.data && selectedCategory.data.map(x => { return (<DictItem data={x}></DictItem>) })}
            </p>
            <p>X</p>
            <p>X</p>
            <p>X</p>
            <p>{JSON.stringify(dict, null, 2)}</p>
        </div>
    )
}

export default DictList;