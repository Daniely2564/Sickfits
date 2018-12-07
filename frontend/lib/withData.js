import withApollo from 'next-with-apollo';
import ApolloClient from 'apollo-boost';
// import { endpoint } from '../config';
const endpoint = 'http://localhost:4444'

function createClient({ headers }) {
  return new ApolloClient({
    uri: process.env.NODE_ENV === 'development' ? endpoint : endpoint,
    request: operation => {
      operation.setContext({
        fetchOptions: {
          credentials: 'include',
        },
        headers,
      });
    },
  });
}

export default withApollo(createClient);
