function ShortuctItem(props){
    console.log(props)
    return (<p>{props.data.shortcut} - {props.data.explanation}</p>)
}
export default ShortuctItem