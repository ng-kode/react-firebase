import React from "react";

import PasswordChangeForm from "../PasswordChange";
import { PasswordForgetForm } from "../PasswordForget";

import { withAuthorization, AuthUserContext } from "../Session";

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

export default withAuthorization(condition)(AccountPage);
