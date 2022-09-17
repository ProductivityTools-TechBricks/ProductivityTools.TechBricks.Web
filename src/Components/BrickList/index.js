import * as apiService from '../../services/apiService'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import BrickItem from '../BrickItem'
import { useAuth } from '../../Session/AuthContext.js'
import { v4 as uuidv4 } from 'uuid'
import { auth } from '../../Session/firebase.js'
import { useParams } from "react-router-dom";
import { getUserName } from '../../Tools/usertools'




function BrickList() {
    const [pallets, setPallets] = useState([])
    const [selectedPallet, setSelectedPallet] = useState(null)
    const [editableFields, setEditableFields] = useState([]);

    const { user } = useAuth();


    let params = useParams();

    useEffect(() => {
        const fetchData = async () => {
            console.log("fetch data")
            // auth.onAuthStateChanged(async function(user) { 
            //     if (user) {
            //         const r = await apiService.getPallets(user,);
            //         if (r != null) {
            //             setPallets(r);
            //             console.log(r);
            //         }
            //     }
            //   });
            console.log(params);
            const r = await apiService.getPallets(user, params.username);
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

    const updateSelectedPalletInPallets = () => {
        let p = [...pallets]
        let pallet = p.find(x => x.document_id == selectedPallet.document_id);
        pallet.bricks = selectedPallet.bricks;
        setPallets(p);
    }

    const updateBrick = (id, description, brick) => {
        console.log("update brick")
        let sp = { ...selectedPallet }
        let item = sp.bricks.find(x => x.id == id);
        // item.key = key;
        // item.value = value;

        item.description=description;
        item.brick=brick;

        setSelectedPallet(sp);

        updateSelectedPalletInPallets();
    }

    const addEditableField = (newuuid) => {
        setEditableFields(editableFields => [...editableFields, newuuid])
    }

    const addBrick = () => {
        console.log("add brick")
        let sp = { ...selectedPallet }
        let newuuid = uuidv4();
        sp.bricks.push({ id: newuuid, description: "", brick: "" });

        setSelectedPallet(sp);
        addEditableField(newuuid);

        updateSelectedPalletInPallets();
    }

    const savePallet = () => {
        console.log("savePallet");
        apiService.updatePallet(user, selectedPallet);
        setEditableFields([]);
    }



    const renderMenu = () => {
        return (<ul>{pallets.map(x => {
            //return (<li><Link to="#" onClick={(e) => categoryClick(e, x.document_id)} >{x.name} - {x.document_id}</Link></li>)
            return (<li><Link to="#" onClick={(e) => categoryClick(e, x.document_id)} >{x.name}</Link></li>)
        })}</ul>)
    }

    const renderBrickItems = () => {
        if (selectedPallet) {
            return (<div>
                <table>
                    {selectedPallet.bricks && selectedPallet.bricks.map(x => {
                        return (<BrickItem brick={x} updateBrick={updateBrick} editableFields={editableFields} addEditableField={addEditableField}></BrickItem>)
                    })}
                </table>
                <button onClick={savePallet}>Save pallet</button>
                <button onClick={addBrick}>Add brick</button>

            </div >)
        }
        else {
            return (<span>Select pallet</span>)
        }
    }

    return (
        <div>
            <p>BrickList</p>
            <p>Logged user: {getUserName()}</p>
            <Link to="/">Home</Link>
            <Link to="/pallets/new">New Pallet</Link>
            <p></p>
            <div className="parent">
                <div className='left'>
                    <span><b>{params.username}</b> pallets: </span>
                    {renderMenu()}
                </div>
                <div className='right'>
                    {renderBrickItems()}
                </div>
            </div>

            {/* <p>{JSON.stringify(pallets, null, 2)}</p> */}
        </div>
    )
}

export default BrickList;