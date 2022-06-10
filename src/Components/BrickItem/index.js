import { useEffect, useState } from "react";

function BrickItem(props) {
    console.log("BrickItem");
    console.log(props)

    const [mode, setMode] = useState('readonly')

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


    const renderReadonly = () => {
        console.log("renderreadonly: ", props.brick.id)
        return (
            <div >
                <div className="listLeft">{props.brick.key}</div>
                <div className="listRight"><span className="p_wrap">{props.brick.value}</span></div>
                <button onClick={() => props.addEditableField(props.brick.id)}>edit</button>
            </div>
        )
    }


    const renderEditable = () => {
        console.log("redner editable: ", props.brick.id)
        return (
            <div className="inputDivContainer">
                    <input className="keyInput" type="text" name="key" value={props.brick.key} onChange={onChange}></input>
                    <textarea name="value" cols="100" rows="5"  value={props.brick.value} onChange={onChange}></textarea>
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