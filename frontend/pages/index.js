import Items from '../components/Items';
const Home = (props) => {
    return (
        <React.Fragment>
            <div>
                Home
            </div>
            <Items page={parseInt(props.query.page)} />
        </React.Fragment>
    )
}

export default Home;