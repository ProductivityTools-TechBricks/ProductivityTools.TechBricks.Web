import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from '../../Session/AuthContext.js'
import { getUserName } from '../../Tools/usertools'


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
        if (e.target.name == 'key') {
            props.updateBrick(props.brick.id, e.target.value, props.brick.value)
        }
        if (e.target.name == 'value') {
            props.updateBrick(props.brick.id, props.brick.key, e.target.value)
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
            <tr>
                    <td><span className="p_wrap">{props.brick.key}</span></td>
                    <td>className="listRight"><span className="p_wrap">{props.brick.value}</span></td>
                    <td>{renderEditButton()}</td>
            </tr>
        )
    }


    const renderEditable = () => {
        console.log("redner editable: ", props.brick.id)
        return (
            <div className="inputDivContainer">
                <textarea className="keyInput" name="key" cols="100" rows="5" value={props.brick.key} onChange={onChange}></textarea>
                <textarea name="value" cols="100" rows="5" value={props.brick.value} onChange={onChange}></textarea>
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