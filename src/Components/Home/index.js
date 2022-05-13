import * as apiService from '../../services/apiService'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

function Home() {


    const [shortuct, setShortucts] = useState([])
    const [SelectedCategory, setSelectedCategory] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            const r = await apiService.getShortcuts();
            if (r != null) {
                setShortucts(r);
                console.log(r);
            }
        }
        fetchData();
    }, []);

    return (
        <div>
            <p>good p</p>
            <p>{JSON.stringify(shortuct, null, 2)}</p>
            <p>xx</p>
            <p>{shortuct.map(x => {
                return (<p><Link to="#" >{x.name}</Link></p>)
            })}</p>
        </div>
    )
}

export default Home;