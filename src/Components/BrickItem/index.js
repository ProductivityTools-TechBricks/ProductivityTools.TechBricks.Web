function BrickItem(props){
    console.log(props)
    return (<p>{props.data.key} - {props.data.value}</p>)
}
export default BrickItem