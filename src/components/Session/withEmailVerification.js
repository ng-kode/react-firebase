import React from "react";
import AuthUserContext from "./context";
import { withFirebase } from "../Firebase";

export default Component => {
  class EmailVerificationWrapper extends React.Component {
    constructor(props) {
      super(props);
      this.state = { isSent: false };
    }

    needEmailVerification = authUser => authUser && !authUser.emailVerified;

    onSendEmailVerification = () => {
      this.props.firebase
        .doSendEmailVerification()
        .then(() => this.setState({ isSent: true }));
    };

    render() {
      return (
        <AuthUserContext.Consumer>
          {authUser =>
            this.needEmailVerification(authUser) ? (
              <div>
                <p>
                  {this.state.isSent
                    ? `E-Mail confirmation sent: Check you E-Mails (Spam folder included) for a confirmation E-Mail.
                        Refresh this page once you confirmed your E-Mail.`
                    : `Verify your E-Mail: Check you E-Mails (Spam folder included)
                        for a confirmation E-Mail or send another confirmation E-Mail.`}
                </p>
                <button
                  disabled={this.state.isSent}
                  type="button"
                  onClick={this.onSendEmailVerification}
                >
                  Send confirmation E-Mail
                </button>
              </div>
            ) : (
              <Component {...this.props} />
            )
          }
        </AuthUserContext.Consumer>
      );
    }
  }

  return withFirebase(EmailVerificationWrapper);
};
