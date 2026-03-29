import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from '../../Session/AuthContext.js'
import { getUserName } from '../../Tools/usertools'
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMove';


function BrickItem(props) {
    console.log("BrickItem");
    console.log(props)

    const [mode, setMode] = useState('readonly')
    const { user } = useAuth();
    let params = useParams();



    useEffect(() => {
        console.log("useEffect BrickItem")
        console.log(props.editableFields);
        console.log(props.brick.id);
        if (props.editableFields.includes(props.brick.id)) {
            setMode('editable')
            console.log("seteditable")
        }
        else {
            setMode('readonly')
            console.log("setreadonly")
        }
    }, [props.editableFields])

    const onChange = (e, k) => {
        console.log("onChange Bricks")
        console.log(e.target.value);
        if (e.target.name == 'description') {
            props.updateBrick(props.brick.id, e.target.value, props.brick.brick)
        }
        if (e.target.name == 'brick') {
            props.updateBrick(props.brick.id, props.brick.description, e.target.value)
        }
    }

    const renderEditButton = () => {
        console.log("renderEditbutton", user);
        let userName = getUserName();
        let paramsUserName = params.username
        //if (userName=paramsUserName) {
        if (true) {
            return (
                <IconButton onClick={() => props.addEditableField(props.brick.id)} size="small">
                    <EditIcon />
                </IconButton >)
        }
    }
    
    const renderDeleteButton = () => {
        console.log("renderEditbutton", user);
        let userName = getUserName();
        let paramsUserName = params.username
        //if (userName=paramsUserName) {
        if (true) {
            return (
                <IconButton onClick={() => props.removeBrick(props.brick.id)} size="small">
                    <DeleteIcon />
                </IconButton >)
        }
    }


    const renderMoveButton = () => {
        if (true) {
            return (
                <IconButton onClick={() => props.initMoveBrick(props.brick)} size="small" title="Move to another Pallet">
                    <DriveFileMoveIcon />
                </IconButton>
            )
        }
    }

    const handleDragStart = (e) => {
        e.dataTransfer.setData("brickId", props.brick.id);
    };

    const renderReadonly = () => {
        console.log("renderreadonly: ", props.brick.id)
        return (
            <tbody draggable onDragStart={handleDragStart} style={{ cursor: 'grab' }}>
                <tr>
                    <td><p className="description">{props.brick.description} {renderEditButton()} {renderDeleteButton()} {renderMoveButton()}</p></td>
                    <td></td>
                </tr>
                <tr>
                    <td><span className="brick">{props.brick.brick}</span></td>
                </tr>
            </tbody>
        )
    }


    const renderEditable = () => {
        console.log("redner editable: ", props.brick.id)
        return (
            <tbody>
                <tr>
                    <td colSpan="2">
                        <input className='keyInput' name="description" size="100" value={props.brick.description} onChange={onChange}></input><br />
                        <textarea className='valueInput' name="brick" cols="100" rows="5" value={props.brick.brick} onChange={onChange}></textarea>
                    </td>
                </tr>
            </tbody>
        )
    }


    if (mode == 'readonly') {
        return renderReadonly();
    }
    else {
        return renderEditable();
    }

}
export default BrickItem