import { Query } from "react-apollo";
import { CURRENT_USER_QUERY } from "./user";
import SignIn from "./signin";

const PleaseSignIn = props => {
  return (
    <Query query={CURRENT_USER_QUERY}>
      {({ data, loading }) => {
        if (loading) return <p>Loading...</p>;
        if (!data.me) {
          return (
            <div>
              <p>Please Sign In!</p>
              <SignIn />
            </div>
          );
        }
        return <div>{props.children}</div>;
      }}
    </Query>
  );
};

export default PleaseSignIn;
