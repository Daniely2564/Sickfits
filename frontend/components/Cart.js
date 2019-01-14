import React from "react";
import CartStyle from "./styles/CartStyles";
import Supreme from "./styles/Supreme";
import CloseButton from "./styles/CloseButton";
import SickButton from "./styles/SickButton";
import gql from "graphql-tag";
import { Query, Mutation } from "react-apollo";

const LOCAL_STATE_QUERY = gql`
  query {
    cartOpen @client
  }
`;

const TOGGLE_CART_MUTATION = gql`
  mutation {
    toggleCart @client
  }
`;

const Cart = () => {
  return (
    <Mutation mutation={TOGGLE_CART_MUTATION}>
      {toggleCart => {
        return (
          <Query query={LOCAL_STATE_QUERY}>
            {({ data }) => {
              return (
                <CartStyle open={data.cartOpen}>
                  <header>
                    <CloseButton title="close" onClick={toggleCart}>
                      &times;
                    </CloseButton>
                    <Supreme>Your Cart</Supreme>
                    <p>You have __ Items in your cart.</p>
                  </header>
                  <footer>
                    <p>$10.10</p>
                    <SickButton>Check Out</SickButton>
                  </footer>
                </CartStyle>
              );
            }}
          </Query>
        );
      }}
    </Mutation>
  );
};

export default Cart;
export { LOCAL_STATE_QUERY, TOGGLE_CART_MUTATION };
