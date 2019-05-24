import React from "react";
import AuthUserContext from "./context";

export default Component => {
  class EmailVerificationWrapper extends React.Component {
    needEmailVerification = authUser => authUser && !authUser.emailVerified;

    render() {
      return (
        <AuthUserContext.Consumer>
          {authUser =>
            this.needEmailVerification(authUser) ? (
              <div>Plz Verify Your Email</div>
            ) : (
              <Component {...this.props} />
            )
          }
        </AuthUserContext.Consumer>
      );
    }
  }

  return EmailVerificationWrapper;
};
