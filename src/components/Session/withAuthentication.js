import React from "react";
import AuthUserContext from "./context";
import { withFirebase } from "../Firebase";

const withAuthentication = Component => {
  class AuthProvider extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        user: null
      };
    }

    componentDidMount() {
      this.listener = this.props.firebase.onAuthUserListener(
        user => this.setState({ user }),
        () => this.setState({ user: null })
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
