import React, { Component } from 'react'
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo'
import Form from './styles/Form'
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './user';

const SIGN_IN_MUTATION = gql`
    mutation SIGN_IN_MUTATION($email:String!,$password:String!){
        signin(email:$email,password:$password){
            name
            id
            email
        }
    }
`

class SignIn extends Component {
    state = {
        password: '',
        email: '',
    }
    saveToState = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }
    render() {
        return (
            <Mutation
                mutation={SIGN_IN_MUTATION}
                variables={this.state}
                refetchQueries={[
                    { query: CURRENT_USER_QUERY, /*variable: if needed*/ } // refetch only mutation is successful.
                ]}
            >
                {(signin, { data, loading, error }) => {
                    return (
                        <Form onSubmit={async (e) => {
                            e.preventDefault();
                            const res = await signin();
                            console.log(res);
                        }}>
                            <fieldset disabled={loading} aria-busy={loading}>
                                <h2>Sign Into Your Account</h2>
                                <Error error={error} />
                                <label htmlFor="email">Email
                                <input type="email" name="email" placeholder="Email" value={this.state.email} onChange={this.saveToState} />
                                </label>
                                <label htmlFor="password">Password
                                <input type="password" name="password" placeholder="Password" value={this.state.password} onChange={this.saveToState} /></label>
                                <button type="submit">Sign Up!</button>
                            </fieldset>
                        </Form>
                    )
                }}
            </Mutation>
        )
    }
}

export default SignIn