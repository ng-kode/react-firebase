import React from "react";
import { compose } from "recompose";

import PasswordChangeForm from "../PasswordChange";
import { PasswordForgetForm } from "../PasswordForget";

import {
  withAuthorization,
  AuthUserContext,
  withEmailVerification
} from "../Session";

const AccountPage = () => (
  <AuthUserContext.Consumer>
    {authUser => (
      <div>
        <h1>Account {authUser.email}</h1>
        <PasswordForgetForm />
        <PasswordChangeForm />
      </div>
    )}
  </AuthUserContext.Consumer>
);

const condition = authUser => authUser !== null;

export default compose(
  withAuthorization(condition),
  withEmailVerification
)(AccountPage);
