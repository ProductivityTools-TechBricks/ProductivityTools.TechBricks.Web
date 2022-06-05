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
            <div>
                <p> {props.brick.key} - {props.brick.value}</p >
                <button onClick={() => props.addEditableField(props.brick.id)}>edit</button>
            </div>
        )
    }


    const renderEditable = () => {
        console.log("redner editable: ", props.brick.id)
        return (
            <div>
                <p>
                    <input type="text" name="key" value={props.brick.key} onChange={onChange}></input>
                    <input type="text" name="value" value={props.brick.value} onChange={onChange}></input>
                </p>
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