import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from '../../Session/AuthContext.js'
import { getUserName } from '../../Tools/usertools'
//import EditIcon from '@mui/icons-material/Edit';


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
            return (<button onClick={() => props.addEditableField(props.brick.id)}>edit</button>)
        }
    }


    const renderReadonly = () => {
        console.log("renderreadonly: ", props.brick.id)
        return (
            <>
                <tr>
                    <td><p className="key">{props.brick.description}</p></td>
                    <td>{renderEditButton()}</td>
                </tr>
                <tr>
                    <td><span className="p_wrap">{props.brick.brick}</span></td>
                </tr>
            </>
        )
    }


    const renderEditable = () => {
        console.log("redner editable: ", props.brick.id)
        return (
            // <div className="inputDivContainer">
            <div>
                <input className='keyInput' name="description" cols="100" rows="5" value={props.brick.description} onChange={onChange}></input><br/>
                <textarea className='valueInput' name="brick" cols="100" rows="5" value={props.brick.brick} onChange={onChange}></textarea>
            </div>
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