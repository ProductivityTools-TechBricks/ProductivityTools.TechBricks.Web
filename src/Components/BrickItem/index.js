import { useState } from "react";

function BrickItem(props) {
    console.log("BrickItem");
    console.log(props)

    const [mode, setMode] = useState('readonly')

    const renderReadonly = () => {
        return (
            <div>
                <p> {props.bricks.key} - {props.bricks.value}</p >
                <button onClick={()=>setMode('editable')}>edit</button>
            </div>
        )
    }

    const renderEditable=()=>{
        return(
            <div>
                <p>
                    <input type="text"></input>
                    <input type="text"></input>
                </p>
                <button onClick={()=>setMode('readonly')}>save</button>
            </div>
        )
    }


    if (mode == 'readonly') {
        return renderReadonly();
    }
    else{
        return renderEditable();
    }

}
export default BrickItem