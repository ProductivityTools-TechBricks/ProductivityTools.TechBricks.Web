import { useState } from "react";

function BrickItem(props) {
    console.log("BrickItem");
    console.log(props)

    const [mode, setMode] = useState('readonly')

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
        return (
            <div>
                <p> {props.brick.key} - {props.brick.value}</p >
                <button onClick={() => setMode('editable')}>edit</button>
            </div>
        )
    }


    const renderEditable = () => {
        return (
            <div>
                <p>
                    <input type="text" name="key" value={props.brick.key} onChange={onChange}></input>
                    <input type="text" name="value" value={props.brick.value} onChange={onChange}></input>
                </p>
                <button onClick={() => setMode('readonly')}>save</button>
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