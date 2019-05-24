import React, { Component, Fragment } from "react";
import { Switch, Route, Link } from "react-router-dom";
import { compose } from "recompose";
import { withFirebase } from "../Firebase";
import { withAuthorization, withEmailVerification } from "../Session";
import * as ROLES from "../../constants/roles";
import * as ROUTES from "../../constants/routes";

class UserListBase extends Component {
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
      <Fragment>
        {loading && <div>Loading...</div>}

        {users.length && (
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
                <span>
                  <Link
                    to={{
                      pathname: `${ROUTES.ADMIN}/users/${user.uid}`,
                      user
                    }}
                  >
                    Details
                  </Link>
                </span>
              </li>
            ))}
          </ul>
        )}
      </Fragment>
    );
  }
}

const UserList = withFirebase(UserListBase);

class UserItemBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      user: { ...props.location.user } || null
    };
  }

  onSendPasswordResetEmail = () => {
    this.props.firebase.doPasswordReset(this.state.user.email);
  };

  componentDidMount() {
    if (this.state.user && Object.keys(this.state.user).length) {
      return;
    }

    this.setState({ loading: true });
    this.props.firebase
      .user(this.props.match.params.id)
      .on("value", snapshot => {
        this.setState({
          loading: false,
          user: snapshot.val()
        });
      });
  }

  componentWillUnmount() {
    this.props.firebase.user(this.props.match.params.id).off();
  }

  render() {
    const { user, loading } = this.state;

    return (
      <div>
        {loading && <p>Loading...</p>}

        {user &&
          Object.keys(this.state.user).map(key => (
            <div key={key}>
              <strong>{key}: </strong> {JSON.stringify(user[key])}
            </div>
          ))}

        <button type="button" onClick={this.onSendPasswordResetEmail}>
          Send Password Reset
        </button>
      </div>
    );
  }
}

const UserItem = withFirebase(UserItemBase);

const AdminPage = () => (
  <div>
    <h1>Admin</h1>

    <Switch>
      <Route exact path={ROUTES.ADMIN_USER_DETAIL} component={UserItem} />
      <Route exact path={ROUTES.ADMIN} component={UserList} />
    </Switch>
  </div>
);

const condition = user => user && user.roles[ROLES.ADMIN];

export default compose(
  withAuthorization(condition),
  withEmailVerification
)(AdminPage);
