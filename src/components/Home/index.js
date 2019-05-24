import React from "react";
import { compose } from "recompose";
import { withAuthorization, withEmailVerification } from "../Session";

function Home(props) {
  return <div>Home</div>;
}

// broad-grained authorization, i.e. signin only
const condition = authUser => authUser !== null;

export default compose(
  withAuthorization(condition),
  withEmailVerification
)(Home);
