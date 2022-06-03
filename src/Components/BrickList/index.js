import * as apiService from '../../services/apiService'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import BrickItem from '../BrickItem'
import { useAuth } from '../../Session/AuthContext.js'


function BrickList() {
    const [dict, setDict] = useState([])
    const [selectedPallet, setSelectedPallet] = useState([])

    const { user } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            console.log("fetch data")
            const r = await apiService.getPallets(user);
            if (r != null) {
                setDict(r);
                console.log(r);
            }
        }
        fetchData();
    }, []);


    const categoryClick = (e, documentId) => {
        console.log(categoryClick)
        console.log(e);
        console.log(documentId)
        let x = dict.find(x => x.document_id == documentId);
        console.log(x);
        setSelectedPallet(x);
    }

    const renderMenu = () => {
        return (<ul>{dict.map(x => {
            return (<li><Link to="#" onClick={(e) => categoryClick(e, x.document_id)} >{x.name} - {x.document_id}</Link></li>)
        })}</ul>)
    }

    const renderBrickItems = () => {
        return (<div>
            {selectedPallet && selectedPallet.bricks && selectedPallet.bricks.map(x => { return (<BrickItem bricks={x}></BrickItem>) })}
            
        </div>)
    }

    return (
        <div>
            <span>BrickList</span>
            <Link to="/home">Home</Link>
            <Link to="/bricks/new">New</Link>
            <Link to="/Pallet/new">New Pellet</Link>
            <p></p>
            <div class="parent">
                <div clas='left'>
                    Pellets:
                    {renderMenu()}
                </div>
                <div class='right'>
                    {renderBrickItems()}
                </div>
            </div>

            {/* <p>{JSON.stringify(dict, null, 2)}</p> */}
        </div>
    )
}

export default BrickList;