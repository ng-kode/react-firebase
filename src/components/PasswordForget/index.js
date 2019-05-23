import React from "react";
import { Link } from "react-router-dom";

import { withFirebase } from "../Firebase";
import * as ROUTES from "../../constants/routes";

const PasswordForgetPage = () => (
  <div>
    <h1>PasswordForget</h1>
    <PasswordForgetForm />
  </div>
);

const INITIAL_STATE = {
  email: "",
  error: null
};
class PasswordForgetFormBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    this.props.firebase
      .doPasswordReset(this.state.email)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
      })
      .catch(error => this.setState({ error }));

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, error } = this.state;
    const invalid = email === "";

    return (
      <form onSubmit={this.onSubmit}>
        <input
          name="email"
          type="email"
          value={email}
          onChange={this.onChange}
          placeholder="Email Address"
        />

        <button disabled={invalid} type="submit">
          Reset Password
        </button>

        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

const PasswordForgetForm = withFirebase(PasswordForgetFormBase);

const PasswordForgetLink = () => (
  <Link to={ROUTES.PASSWORD_FORGET}>Forget Password</Link>
);

export default PasswordForgetPage;
export { PasswordForgetForm, PasswordForgetLink };
