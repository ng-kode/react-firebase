import React from "react";
import { withAuthorization } from "../Session";

function Home(props) {
  return <div>Home</div>;
}

// broad-grained authorization, i.e. signin only
const condition = authUser => authUser !== null;

export default withAuthorization(condition)(Home);
