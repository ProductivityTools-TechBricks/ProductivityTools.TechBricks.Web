function Bricks(props) {


    const newBrick = () => {

    }

    return (
        <div>
            <ul>
                {props.bricks.map((item) => {
                    return (<span>{item.key}</span>)
                })}
            </ul>
            <button onClick={newBrick}>Add Brick</button>
        </div>

    )
}

export default Bricks