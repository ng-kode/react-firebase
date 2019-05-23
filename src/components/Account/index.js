import React from "react";
import PasswordChangeForm from "../PasswordChange";
import { PasswordForgetForm } from "../PasswordForget";

const AccountPage = () => (
  <div>
    <h1>Account Page</h1>
    <PasswordForgetForm />
    <PasswordChangeForm />
  </div>
);

export default AccountPage;
