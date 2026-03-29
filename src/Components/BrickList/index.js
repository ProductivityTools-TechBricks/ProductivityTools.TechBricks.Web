import * as apiService from '../../services/apiService'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import BrickItem from '../BrickItem'
import { useAuth } from '../../Session/AuthContext.js'
import { v4 as uuidv4 } from 'uuid'
import { auth } from '../../Session/firebase.js'
import { useParams } from "react-router-dom";
import { getUserName } from '../../Tools/usertools'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

function BrickList() {
    const [pallets, setPallets] = useState([])
    const [palletsRefresher, setPalletsRefresher] = useState(1);
    const [selectedPallet, setSelectedPallet] = useState(null)
    const [editableFields, setEditableFields] = useState([]);
    
    // Context Menu State
    const [contextMenu, setContextMenu] = useState(null);
    const [contextMenuPallet, setContextMenuPallet] = useState(null);
    const [renamingPalletId, setRenamingPalletId] = useState(null);
    const [renamingPalletName, setRenamingPalletName] = useState("");
    const [renameDialogOpen, setRenameDialogOpen] = useState(false);
    
    // Delete Dialog State
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [palletToDelete, setPalletToDelete] = useState(null);

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
            console.log("params", params);
            const r = await apiService.getPallets(user, params.username);
            if (r != null) {
                setPallets(r);
                console.log(r);
            }
        }
        fetchData();
    }, [palletsRefresher]);


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
        //removing legacy property
        delete item.key;
        delete item.value;

        item.description = description;
        item.brick = brick;

        setSelectedPallet(sp);

        updateSelectedPalletInPallets();
    }

    const removeBrick = (id) => {
        console.log("remove brick- not working now")

        let sp = { ...selectedPallet }
        console.log(sp);
        for (var i = 0; i < sp.bricks.length; i++) {
            if (sp.bricks[i].id == id) {
                sp.bricks.splice(i, 1)
                i--;
            }
        }
        console.log(sp);
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

    const removePellet = () => {
        if (selectedPallet) {
            setPalletToDelete(selectedPallet);
            setDeleteDialogOpen(true);
        }
    }

    // Context Menu Handlers
    const handleContextMenu = (event, pallet) => {
        event.preventDefault();
        setContextMenu(
            contextMenu === null
                ? {
                      mouseX: event.clientX + 2,
                      mouseY: event.clientY - 6,
                  }
                : null
        );
        setContextMenuPallet(pallet);
    };

    const handleCloseMenu = () => {
        setContextMenu(null);
        setContextMenuPallet(null);
    };

    const handleMenuDelete = () => {
        if (contextMenuPallet) {
            setPalletToDelete(contextMenuPallet);
            setDeleteDialogOpen(true);
        }
        handleCloseMenu();
    };

    const handleConfirmDelete = async () => {
        if (palletToDelete) {
            await apiService.removePellet(user, palletToDelete);
            setPalletsRefresher(palletsRefresher + 1);
            if (selectedPallet && selectedPallet.document_id === palletToDelete.document_id) {
                setSelectedPallet(null);
            }
        }
        setDeleteDialogOpen(false);
        setPalletToDelete(null);
    };

    const handleCancelDelete = () => {
        setDeleteDialogOpen(false);
        setPalletToDelete(null);
    };

    const handleMenuRename = () => {
        if (contextMenuPallet) {
            setRenamingPalletId(contextMenuPallet.document_id);
            setRenamingPalletName(contextMenuPallet.name);
            setRenameDialogOpen(true);
        }
        handleCloseMenu();
    };

    const handleRenameDialogClose = () => {
        setRenameDialogOpen(false);
        setRenamingPalletId(null);
    };

    const handleRenameDialogSubmit = async () => {
        let pallet = pallets.find(p => p.document_id === renamingPalletId);
        if (pallet && renamingPalletName.trim() !== "" && renamingPalletName !== pallet.name) {
            let updatedPallet = { ...pallet, name: renamingPalletName };
            // Handled efficiently with dedicated rename/PATCH method
            await apiService.renamePallet(user, pallet.document_id, renamingPalletName);
            setPalletsRefresher(palletsRefresher + 1);
            if (selectedPallet && selectedPallet.document_id === pallet.document_id) {
                setSelectedPallet(updatedPallet);
            }
        }
        handleRenameDialogClose();
    };


    const renderMenu = () => {
        return (<ul>{pallets.sort((a, b) => (a.name > b.name) ? 1 : -1).map(x => {
            //return (<li><Link to="#" onClick={(e) => categoryClick(e, x.document_id)} >{x.name} - {x.document_id}</Link></li>)
            return (<li><Link to="#" onClick={(e) => categoryClick(e, x.document_id)} >{x.name}</Link></li>)
        })}</ul>)
    }

    const renderBrickItems = () => {
        if (selectedPallet) {
            return (<div>
                <table>
                    <tbody>
                        {selectedPallet.bricks && selectedPallet.bricks.map(x => {
                            return (<BrickItem key={x.id} brick={x} updateBrick={updateBrick} removeBrick={removeBrick} editableFields={editableFields} addEditableField={addEditableField}></BrickItem>)
                        })}
                    </tbody>
                </table>
                <button onClick={savePallet}>Save pallet</button>
                <button onClick={addBrick}>Add brick</button>
                <button onClick={removePellet}>Remove Pellet</button>

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
            <p>{palletsRefresher}</p>
            <div className="parent">
                <div className='left'>
                    <span><b>{params.username}</b> pallets: </span>
                    {/* {renderMenu()} */}
                    <ul>{pallets.sort((a, b) => (a.name > b.name) ? 1 : -1).map(x => {
                        return (
                            <li key={x.document_id} onContextMenu={(e) => handleContextMenu(e, x)}>
                                <Link to="#" onClick={(e) => categoryClick(e, x.document_id)}>
                                    {x.name}
                                </Link>
                            </li>
                        )
                    })}</ul>
                    <Menu
                        open={contextMenu !== null}
                        onClose={handleCloseMenu}
                        anchorReference="anchorPosition"
                        anchorPosition={
                            contextMenu !== null
                                ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                                : undefined
                        }
                    >
                        <MenuItem disabled style={{ opacity: 1, fontWeight: 'bold', borderBottom: '1px solid #e0e0e0', marginBottom: '8px', color: 'black' }}>
                            {contextMenuPallet ? contextMenuPallet.name : ''}
                        </MenuItem>
                        <MenuItem onClick={handleMenuRename}>Rename</MenuItem>
                        <MenuItem onClick={handleMenuDelete}>Delete</MenuItem>
                    </Menu>
                    <Dialog open={renameDialogOpen} onClose={handleRenameDialogClose}>
                        <DialogTitle>Rename Pallet</DialogTitle>
                        <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Pallet Name"
                                type="text"
                                fullWidth
                                variant="standard"
                                value={renamingPalletName}
                                onChange={(e) => setRenamingPalletName(e.target.value)}
                                onKeyDown={(e) => { if(e.key === 'Enter') handleRenameDialogSubmit(); }}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleRenameDialogClose}>Cancel</Button>
                            <Button onClick={handleRenameDialogSubmit}>Save</Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                Are you sure you want to delete the pallet "{palletToDelete?.name}"?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCancelDelete}>Cancel</Button>
                            <Button onClick={handleConfirmDelete} color="error" variant="contained">Delete</Button>
                        </DialogActions>
                    </Dialog>
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
