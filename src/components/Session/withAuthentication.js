import React from "react";
import AuthUserContext from "./context";
import { withFirebase } from "../Firebase";

const withAuthentication = Component => {
  class AuthProvider extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        user: JSON.parse(localStorage.getItem("authUser"))
      };
    }

    setUser = user => {
      this.setState({ user });
      localStorage.setItem("authUser", JSON.stringify(user));
    };

    removeUser = () => {
      this.setState({ user: null });
      localStorage.removeItem("authUser");
    };

    componentDidMount() {
      this.listener = this.props.firebase.onAuthUserListener(
        user => this.setUser(user),
        this.removeUser
      );
    }

    componentWillUnmount() {
      this.listener();
    }

    render() {
      return (
        <AuthUserContext.Provider value={this.state.user}>
          <Component {...this.props} />
        </AuthUserContext.Provider>
      );
    }
  }

  return withFirebase(AuthProvider);
};

export default withAuthentication;
