import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import ErrorMessage from "./ErrorMessage";
import Table from "./styles/Table";
import SickButton from "./styles/SickButton";
import PropTypes from "prop-types";

const possiblePermissions = [
  "ADMIN",
  "USER",
  "ITEMCREATE",
  "ITEMUPDATE",
  "ITEMDELETE",
  "PERMISSIONUPDATE"
];

const ALL_USER_QUERY = gql`
  query ALL_USER_QUERY {
    users {
      id
      name
      email
      permissions
    }
  }
`;

const UPDATE_PERMISSIONS_MUTATION = gql`
  mutation UPDATE_PERMISSIONS_MUTATION(
    $userId: ID!
    $permissions: [Permission]
  ) {
    updatePermissions(userId: $userId, permissions: $permissions) {
      id
      permissions
      name
      email
    }
  }
`;

const Permissions = props => {
  return (
    <Query query={ALL_USER_QUERY}>
      {({ data, loading, error }) => {
        console.log(data);
        return (
          <div>
            <ErrorMessage error={error} />
            <p>Permissions</p>
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  {possiblePermissions.map(p => (
                    <th key={p}>{p}</th>
                  ))}
                  <th>✔</th>
                </tr>
              </thead>
              <tbody>
                {data.users.map(u => (
                  <UserPermission user={u} key={u.id} />
                ))}
              </tbody>
            </Table>
          </div>
        );
      }}
    </Query>
  );
};

class UserPermission extends React.Component {
  static propTypes = {
    // user:PropTypes.object.isRequired,
    user: PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.string,
      email: PropTypes.string,
      permissions: PropTypes.array
    }).isRequired
  };
  state = {
    permissions: this.props.user.permissions
  };
  handlePermissionChange = e => {
    const checkBox = e.target;
    let updatedPermissions = [...this.state.permissions];
    if (checkBox.checked) {
      //add it in
      updatedPermissions.push(checkBox.value);
    } else {
      updatedPermissions = updatedPermissions.filter(p => {
        return p !== checkBox.value;
      });
    }
    this.setState({ permissions: updatedPermissions });
  };
  render() {
    const { user } = this.props;
    return (
      <tr>
        <td>{user.name}</td>
        <td>{user.email}</td>
        {possiblePermissions.map((p, no) => (
          <td key={no}>
            <label htmlFor={`${user.id}-permission-${p}`}>
              <input
                id={`${user.id}-permission-${p}`}
                type="checkbox"
                checked={this.state.permissions.includes(p)}
                value={p}
                onChange={this.handlePermissionChange}
              />
            </label>
          </td>
        ))}
        <td>
          <Mutation
            mutation={UPDATE_PERMISSIONS_MUTATION}
            variables={{ userId: user.id, permissions: this.state.permissions }}
          >
            {(updatePermissions, { data, loading, err }) => {
              console.log(data);
              return (
                <SickButton
                  onClick={() => {
                    updatePermissions();
                  }}
                >
                  Updat{loading ? "ing" : "e"}!
                </SickButton>
              );
            }}
          </Mutation>
        </td>
      </tr>
    );
  }
}

export default Permissions;
