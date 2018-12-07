import UpdateItem from '../components/updateItem'
const Sell = (props) => {
    return (
        <React.Fragment>
            <UpdateItem id={props.query.id} />
        </React.Fragment>
    )
}

export default Sell;    