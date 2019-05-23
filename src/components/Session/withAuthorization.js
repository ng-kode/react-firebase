import React from "react";
import { compose } from "recompose";
import { withRouter } from "react-router-dom";

import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";
import AuthUserContext from "./context";

// condition is a function which will be passed upon use.
// This gives flexibility for different kinds of authorization
// (e.g. signin only, admin only, etc)
const withAuthorization = condition => Component => {
  class AuthorizationWrapper extends React.Component {
    componentDidMount() {
      this.listener = this.props.firebase.auth.onAuthStateChanged(authUser => {
        if (!condition(authUser)) {
          this.props.history.push(ROUTES.SIGN_IN);
        }
      });
    }

    componentWillUnmount() {
      this.listener();
    }

    render() {
      return (
        <AuthUserContext.Consumer>
          {authUser =>
            condition(authUser) ? <Component {...this.props} /> : null
          }
        </AuthUserContext.Consumer>
      );
    }
  }

  return compose(
    withRouter,
    withFirebase
  )(AuthorizationWrapper);
};

export default withAuthorization;
