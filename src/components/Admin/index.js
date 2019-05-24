import React, { Component } from "react";
import { compose } from "recompose";
import { withFirebase } from "../Firebase";
import { withAuthorization, withEmailVerification } from "../Session";
import * as ROLES from "../../constants/roles";

class AdminPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      users: []
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    this.props.firebase.users().on("value", snapshot => {
      const usersObject = snapshot.val();

      this.setState({
        loading: false,
        users: Object.keys(usersObject).map(key => ({
          ...usersObject[key],
          uid: key
        }))
      });
    });
  }

  componentWillUnmount() {
    this.props.firebase.users().off();
  }

  render() {
    const { users, loading } = this.state;

    return (
      <div>
        <h1>Admin</h1>

        {loading && <div>Loading...</div>}

        <UserList users={users} />
      </div>
    );
  }
}

const UserList = ({ users }) => (
  <ul>
    {users.map(user => (
      <li key={user.uid}>
        <span>
          <strong>ID: </strong> {user.uid}
        </span>
        <span>
          <strong>Email</strong> {user.email}
        </span>
        <span>
          <strong>Username</strong> {user.username}
        </span>
      </li>
    ))}
  </ul>
);

const condition = user => user && user.roles[ROLES.ADMIN];

export default compose(
  withAuthorization(condition),
  withFirebase,
  withEmailVerification
)(AdminPage);
