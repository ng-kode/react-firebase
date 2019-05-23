import React from "react";

import PasswordChangeForm from "../PasswordChange";
import { PasswordForgetForm } from "../PasswordForget";

import { withAuthorization } from "../Session";

const AccountPage = () => (
  <div>
    <h1>Account Page</h1>
    <PasswordForgetForm />
    <PasswordChangeForm />
  </div>
);

const condition = authUser => authUser !== null;

export default withAuthorization(condition)(AccountPage);
