import Link from 'next/link';
import NavStyles from '../components/styles/NavStyles';
import User from '../components/user';

const Nav = () => (
    <User>
        {({ data }) => {
            return (
                <NavStyles>
                    <Link href="/items"><a>Shop</a></Link>
                    {data.me && (
                        <React.Fragment>
                            <Link href="/sell"><a>Sell</a></Link>
                            <Link href="/orders"><a>Orders</a></Link>
                            <Link href="/me"><a>Account</a></Link>
                        </React.Fragment>
                    )
                    }
                    {!data.me && <Link href="/signup"><a>Signup</a></Link>}
                </NavStyles>
            )
        }}
    </User>
)

export default Nav;