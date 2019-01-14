import React, { Component } from "react";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import Form from "./styles/Form";
import Error from "./ErrorMessage";

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    requestReset(email: $email) {
      message
    }
  }
`;

class RequestReset extends Component {
  state = {
    email: ""
  };
  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  render() {
    return (
      <Mutation mutation={REQUEST_RESET_MUTATION} variables={this.state}>
        {(reset, { data, loading, error, called }) => {
          return (
            <Form
              onSubmit={async e => {
                e.preventDefault();
                const res = await reset();
                console.log(res);
              }}
            >
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Sign Into Your Account</h2>
                <Error error={error} />
                {!error && !loading && called && (
                  <p>Success! Check your Email!</p>
                )}
                <label htmlFor="email">
                  Email
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={this.state.email}
                    onChange={this.saveToState}
                  />
                </label>
                <button type="submit">Request Password!</button>
              </fieldset>
            </Form>
          );
        }}
      </Mutation>
    );
  }
}

export default RequestReset;
