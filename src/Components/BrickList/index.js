import * as apiService from '../../services/apiService'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import BrickItem from '../BrickItem'
import { useAuth } from '../../Session/AuthContext.js'


function BrickList() {
    const [pallets, setPallets] = useState([])
    const [selectedPallet, setSelectedPallet] = useState([])

    const { user } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            console.log("fetch data")
            const r = await apiService.getPallets(user);
            if (r != null) {
                setPallets(r);
                console.log(r);
            }
        }
        fetchData();
    }, []);


    const categoryClick = (e, documentId) => {
        console.log(categoryClick)
        console.log(e);
        console.log(documentId)
        let x = pallets.find(x => x.document_id == documentId);
        console.log(x);
        setSelectedPallet(x);

    }

    const updateBrick=(id,key,value)=>{
        console.log("update brick")
        debugger;
        let sp={...selectedPallet}
        let item=sp.bricks.find(x=>x.id==id);
        item.key=key;
        item.value=value;
        setSelectedPallet(sp);

        let p=[...pallets]
        let pallet=p.find(x=>x.document_id==selectedPallet.document_id);
        pallet.bricks=selectedPallet.bricks;
        setPallets(p);
        
    }

    const renderMenu = () => {
        return (<ul>{pallets.map(x => {
            return (<li><Link to="#" onClick={(e) => categoryClick(e, x.document_id)} >{x.name} - {x.document_id}</Link></li>)
        })}</ul>)
    }

    const renderBrickItems = () => {
        return (<div>
            {selectedPallet && selectedPallet.bricks && selectedPallet.bricks.map(x => { return (<BrickItem brick={x} updateBrick={updateBrick}></BrickItem>) })}
            
        </div>)
    }

    return (
        <div>
            <span>BrickList</span>
            <Link to="/home">Home</Link>
            <Link to="/pallets/new">New</Link>
            <Link to="/pallets/new">New Pellet</Link>
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

            {/* <p>{JSON.stringify(pallets, null, 2)}</p> */}
        </div>
    )
}

export default BrickList;