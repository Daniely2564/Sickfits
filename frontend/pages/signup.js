import SignUpPage from '../components/Signup';
import styled from 'styled-components';
import SignInPage from '../components/signin'

const Columns = styled.div`
    display:grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    grid-gap: 20px;
`

const Signup = () => {
    return (
        <Columns>
            <SignUpPage />
            <SignInPage />
        </Columns>
    )
}

export default Signup;    