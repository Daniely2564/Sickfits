import withApollo from "next-with-apollo";
import ApolloClient from "apollo-boost";
// import { endpoint } from '../config';
import { LOCAL_STATE_QUERY, TOGGLE_CART_MUTATION } from "../components/Cart";

const endpoint = "http://localhost:4444";

function createClient({ headers }) {
  return new ApolloClient({
    uri: process.env.NODE_ENV === "development" ? endpoint : endpoint,
    request: operation => {
      operation.setContext({
        fetchOptions: {
          credentials: "include"
        },
        headers
      });
    },
    //local state
    clientState: {
      resolvers: {
        Mutation: {
          toggleCart(_, variables, client) {
            // read the cartOpen value from the cache
            const res = client.cache.readQuery({
              query: LOCAL_STATE_QUERY
            });
            const data = {
              data: { cartOpen: !res.cartOpen }
            };
            client.cache.writeData(data);
            return data;
          }
        }
      },
      defaults: {
        cartOpen: true
      }
    }
  });
}

export default withApollo(createClient);
