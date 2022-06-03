function BrickItem(props){
    console.log("BrickItem");
    console.log(props)
    
    return (<p>{props.bricks.key} - {props.bricks.value}</p>)
}
export default BrickItem