import * as apiService from '../../services/apiService'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import BrickItem, { brickTitle, brickValue } from '../BrickItem'
import { useAuth } from '../../Session/AuthContext.js'
import { logout } from '../../Session/firebase'
import { v4 as uuidv4 } from 'uuid'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import Snackbar from '@mui/material/Snackbar';

const SAVE_DELAY_MS = 800;
const byName = (a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });

// Very old bricks may have no id; give them one so they can be edited.
const withBrickIds = (pallets) => (pallets || []).map(p => ({
    ...p,
    bricks: (p.bricks || []).map(b => b.id ? b : { ...b, id: uuidv4() }),
}));

const matches = (brick, q) => {
    if (!q) return true;
    const needle = q.toLowerCase();
    return brickTitle(brick).toLowerCase().includes(needle) || brickValue(brick).toLowerCase().includes(needle);
};

function BrickList() {
    const [pallets, setPallets] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedId, setSelectedId] = useState(null)
    const [editingIds, setEditingIds] = useState([]);
    const [palletFilter, setPalletFilter] = useState('');
    const [brickFilter, setBrickFilter] = useState('');
    const [saveState, setSaveState] = useState('saved');
    const [snack, setSnack] = useState(null);

    // Context Menu State
    const [contextMenu, setContextMenu] = useState(null);
    const [contextMenuPallet, setContextMenuPallet] = useState(null);
    const [renamingPalletId, setRenamingPalletId] = useState(null);
    const [renamingPalletName, setRenamingPalletName] = useState("");
    const [renameDialogOpen, setRenameDialogOpen] = useState(false);

    // Delete Dialog State
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [palletToDelete, setPalletToDelete] = useState(null);

    // Move Brick State
    const [moveBrickDialogOpen, setMoveBrickDialogOpen] = useState(false);
    const [brickToMove, setBrickToMove] = useState(null);
    const [targetPalletIdMove, setTargetPalletIdMove] = useState("");
    const [dragHoveredPalletId, setDragHoveredPalletId] = useState(null);

    const { user, userName, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const params = useParams();
    const brickFilterRef = useRef(null);

    // Always-current pallets for callbacks (debounced save, undo).
    const palletsRef = useRef(pallets);
    palletsRef.current = pallets;
    const pending = useRef(new Map());
    const saveTimer = useRef(null);

    const selectedPallet = pallets.find(p => p.document_id === selectedId) || null;

    const loadPallets = useCallback(async () => {
        const r = withBrickIds(await apiService.getPallets(user, params.username));
        setPallets(r);
        return r;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.uid, params.username]);

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            navigate('/login');
            return;
        }
        setLoading(true);
        loadPallets()
            .then(r => setSelectedId(id => r.some(p => p.document_id === id) ? id : (r.length ? [...r].sort(byName)[0].document_id : null)))
            .catch(err => setSnack({ message: `Unable to load pallets: ${err.message}` }))
            .finally(() => setLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [authLoading, user?.uid, params.username]);

    // ---- autosave -----------------------------------------------------------
    const flush = useCallback(async () => {
        clearTimeout(saveTimer.current);
        const items = [...pending.current.values()];
        pending.current.clear();
        if (items.length === 0) return;
        setSaveState('saving');
        try {
            await Promise.all(items.map(p => apiService.updatePallet(user, p)));
            setSaveState(pending.current.size ? 'unsaved' : 'saved');
        } catch (err) {
            console.error("Saving failed", err);
            items.forEach(p => { if (!pending.current.has(p.document_id)) pending.current.set(p.document_id, p); });
            setSaveState('error');
        }
    }, [user]);

    // Applies `change` to a pallet, updates the UI immediately and saves it with a delay.
    const changePallet = useCallback((palletId, change) => {
        const current = palletsRef.current.find(p => p.document_id === palletId);
        if (!current) return;
        const updated = change(current);
        const next = palletsRef.current.map(p => p.document_id === palletId ? updated : p);
        palletsRef.current = next;
        setPallets(next);
        pending.current.set(palletId, updated);
        setSaveState('unsaved');
        clearTimeout(saveTimer.current);
        saveTimer.current = setTimeout(flush, SAVE_DELAY_MS);
    }, [flush]);

    useEffect(() => {
        const beforeUnload = (e) => {
            if (pending.current.size > 0) {
                flush();
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', beforeUnload);
        return () => {
            window.removeEventListener('beforeunload', beforeUnload);
            flush();
        };
    }, [flush]);

    // Ctrl+F focuses the brick filter.
    useEffect(() => {
        const onKey = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f' && brickFilterRef.current) {
                e.preventDefault();
                brickFilterRef.current.focus();
                brickFilterRef.current.select();
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    const selectPallet = (id) => {
        setSelectedId(id);
        setEditingIds([]);
        setBrickFilter('');
    }

    // ---- bricks -------------------------------------------------------------
    const updateBrick = (id, description, brick) => {
        changePallet(selectedId, p => ({
            ...p,
            bricks: p.bricks.map(b => {
                if (b.id !== id) return b;
                //removing legacy property
                const { key, value, ...rest } = b;
                return { ...rest, description, brick };
            }),
        }));
    }

    const removeBrick = (id) => {
        const palletId = selectedId;
        const pallet = palletsRef.current.find(p => p.document_id === palletId);
        const index = pallet.bricks.findIndex(b => b.id === id);
        const removed = pallet.bricks[index];
        changePallet(palletId, p => ({ ...p, bricks: p.bricks.filter(b => b.id !== id) }));
        setSnack({
            message: `Deleted "${brickTitle(removed) || 'Untitled'}"`,
            undo: () => changePallet(palletId, p => {
                const bricks = [...p.bricks];
                bricks.splice(Math.min(index, bricks.length), 0, removed);
                return { ...p, bricks };
            }),
        });
    }

    const addBrick = () => {
        if (!selectedPallet) return;
        const newuuid = uuidv4();
        setBrickFilter('');
        changePallet(selectedId, p => ({ ...p, bricks: [{ id: newuuid, description: "", brick: "" }, ...p.bricks] }));
        setEditingIds(ids => [...ids, newuuid]);
    }

    const finishEditing = (id) => {
        setEditingIds(ids => ids.filter(x => x !== id));
        const brick = selectedPallet?.bricks.find(b => b.id === id);
        // Drop bricks that were added and left empty.
        if (brick && !brickTitle(brick).trim() && !brickValue(brick).trim()) {
            changePallet(selectedId, p => ({ ...p, bricks: p.bricks.filter(b => b.id !== id) }));
        }
    }

    const copyValue = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            setSnack({ message: 'Copied to clipboard' });
        } catch {
            setSnack({ message: 'Unable to copy - the browser blocked the clipboard' });
        }
    }

    // Moves a brick between pallets by saving both of them.
    const moveBrick = (brickId, targetPalletId) => {
        const sourceId = selectedId;
        if (!brickId || !targetPalletId || targetPalletId === sourceId) return;
        const source = palletsRef.current.find(p => p.document_id === sourceId);
        const target = palletsRef.current.find(p => p.document_id === targetPalletId);
        const brick = source?.bricks.find(b => b.id === brickId);
        if (!brick || !target) return;
        changePallet(sourceId, p => ({ ...p, bricks: p.bricks.filter(b => b.id !== brickId) }));
        changePallet(targetPalletId, p => ({ ...p, bricks: [...p.bricks, brick] }));
        setSnack({ message: `Moved "${brickTitle(brick) || 'Untitled'}" to ${target.name}` });
    }

    // ---- pallets ------------------------------------------------------------
    const handleContextMenu = (event, pallet) => {
        event.preventDefault();
        setContextMenu(contextMenu === null ? { mouseX: event.clientX + 2, mouseY: event.clientY - 6 } : null);
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
            pending.current.delete(palletToDelete.document_id);
            await apiService.removePellet(user, palletToDelete);
            setPallets(ps => ps.filter(p => p.document_id !== palletToDelete.document_id));
            if (selectedId === palletToDelete.document_id) {
                setSelectedId(null);
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
        const pallet = pallets.find(p => p.document_id === renamingPalletId);
        const name = renamingPalletName.trim();
        if (pallet && name !== "" && name !== pallet.name) {
            await apiService.renamePallet(user, pallet.document_id, name);
            setPallets(ps => ps.map(p => p.document_id === pallet.document_id ? { ...p, name } : p));
        }
        handleRenameDialogClose();
    };

    const handleDrop = (e, targetPalletId) => {
        e.preventDefault();
        setDragHoveredPalletId(null);
        moveBrick(e.dataTransfer.getData("brickId"), targetPalletId);
    };

    const initMoveBrick = (brick) => {
        setBrickToMove(brick);
        setTargetPalletIdMove("");
        setMoveBrickDialogOpen(true);
    };

    const handleMoveBrickDialogClose = () => {
        setMoveBrickDialogOpen(false);
        setBrickToMove(null);
        setTargetPalletIdMove("");
    };

    const handleMoveBrickSubmit = () => {
        if (brickToMove && targetPalletIdMove) {
            moveBrick(brickToMove.id, targetPalletIdMove);
        }
        handleMoveBrickDialogClose();
    };

    const logoutAction = async () => {
        await flush();
        await logout();
        navigate("/login");
    }

    // ---- rendering ----------------------------------------------------------
    const saveLabel = { saved: '✓ saved', unsaved: 'unsaved changes…', saving: 'saving…', error: '⚠ save failed' }[saveState];
    const visiblePallets = [...pallets].sort(byName).filter(p => p.name.toLowerCase().includes(palletFilter.toLowerCase()));
    const visibleBricks = selectedPallet ? selectedPallet.bricks.filter(b => editingIds.includes(b.id) || matches(b, brickFilter)) : [];

    const renderBrickItems = () => {
        if (loading) {
            return <p className="tb-muted">Loading…</p>
        }
        if (!selectedPallet) {
            return <p className="tb-muted">{pallets.length ? 'Select pallet' : 'No pallets yet - create one with "+ new pallet".'}</p>
        }
        return (
            <>
                <div className="main__header">
                    {selectedPallet.owners?.filter(o => o !== userName).length > 0 &&
                        <span className="tb-muted">shared with {selectedPallet.owners.filter(o => o !== userName).join(', ')}</span>}
                    <input
                        ref={brickFilterRef}
                        className="tb-input main__filter"
                        placeholder="filter bricks (Ctrl+F)"
                        value={brickFilter}
                        onChange={(e) => setBrickFilter(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Escape') setBrickFilter(''); }}
                    />
                    <button className="tb-button" onClick={addBrick}>+ brick</button>
                </div>
                {selectedPallet.bricks.length === 0 && <p className="tb-muted">This pallet is empty.</p>}
                {selectedPallet.bricks.length > 0 && visibleBricks.length === 0 && <p className="tb-muted">No bricks match "{brickFilter}".</p>}
                {visibleBricks.map(x => (
                    <BrickItem
                        key={x.id}
                        brick={x}
                        query={brickFilter}
                        editing={editingIds.includes(x.id)}
                        onEdit={() => setEditingIds(ids => ids.includes(x.id) ? ids : [...ids, x.id])}
                        onDone={() => finishEditing(x.id)}
                        updateBrick={updateBrick}
                        removeBrick={removeBrick}
                        initMoveBrick={initMoveBrick}
                        onCopy={copyValue}
                    />
                ))}
            </>
        )
    }

    return (
        <div className="tb-page">
            <div className="topbar">
                <Link to="/" className="topbar__logo">TechBricks</Link>
                <span className={`topbar__save topbar__save--${saveState}`}>{saveLabel}</span>
                <span className="tb-muted">{userName}</span>
                <button className="tb-link" onClick={logoutAction}>logout</button>
            </div>
            <div className="parent">
                <div className='left'>
                    <input className="tb-input left__filter" placeholder="filter pallets" value={palletFilter} onChange={(e) => setPalletFilter(e.target.value)} />
                    {params.username && userName && params.username !== userName &&
                        <div className="left__owner"><b>{params.username}</b> pallets shared with you</div>}
                    <ul className="pallets">{visiblePallets.map(x => (
                        <li
                            key={x.document_id}
                            className={[
                                x.document_id === selectedId ? 'pallets__item--selected' : '',
                                x.document_id === dragHoveredPalletId ? 'pallets__item--drop' : '',
                            ].join(' ')}
                            onClick={() => selectPallet(x.document_id)}
                            onContextMenu={(e) => handleContextMenu(e, x)}
                            onDragOver={(e) => { e.preventDefault(); setDragHoveredPalletId(x.document_id); }}
                            onDragLeave={() => setDragHoveredPalletId(null)}
                            onDrop={(e) => handleDrop(e, x.document_id)}
                        >
                            <span className="pallets__name">» {x.name}</span>
                            <span className="pallets__count">{x.bricks.length || ''}</span>
                        </li>
                    ))}</ul>
                    <Link to="/pallets/new" className="left__new">+ new pallet</Link>
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
                    <Dialog open={moveBrickDialogOpen} onClose={handleMoveBrickDialogClose}>
                        <DialogTitle>Move Brick</DialogTitle>
                        <DialogContent>
                            <DialogContentText sx={{ mb: 2 }}>
                                Select the destination pallet to move this brick:
                            </DialogContentText>
                            <FormControl fullWidth>
                                <InputLabel>Target Pallet</InputLabel>
                                <Select
                                    value={targetPalletIdMove}
                                    label="Target Pallet"
                                    onChange={(e) => setTargetPalletIdMove(e.target.value)}
                                >
                                    {[...pallets].sort(byName).filter(p => p.document_id !== selectedId).map((p) => (
                                        <MenuItem key={p.document_id} value={p.document_id}>
                                            {p.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleMoveBrickDialogClose}>Cancel</Button>
                            <Button onClick={handleMoveBrickSubmit} disabled={!targetPalletIdMove}>Move</Button>
                        </DialogActions>
                    </Dialog>
                </div>
                <div className='right'>
                    {renderBrickItems()}
                </div>
            </div>
            <Snackbar
                open={Boolean(snack)}
                autoHideDuration={snack?.undo ? 6000 : 2000}
                onClose={(_, reason) => { if (reason !== 'clickaway') setSnack(null); }}
                message={snack?.message}
                action={snack?.undo ? <Button color="inherit" size="small" onClick={() => { snack.undo(); setSnack(null); }}>Undo</Button> : undefined}
            />
        </div>
    )
}

export default BrickList;
