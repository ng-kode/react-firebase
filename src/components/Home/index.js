import React, { Fragment } from "react";
import { compose } from "recompose";
import {
  withAuthorization,
  withEmailVerification,
  AuthUserContext
} from "../Session";
import { withFirebase } from "../Firebase";
import ReadItems from "../Items";

function Home(props) {
  return (
    <div>
      <h1>Home</h1>

      <Messages />
    </div>
  );
}

class MessagesBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: ""
    };
  }

  onChangeText = event => {
    this.setState({ text: event.target.value });
  };

  onCreateMessage = (event, authUser) => {
    this.props.firebase.messages().push({
      text: this.state.text,
      userId: authUser.uid
    });

    this.setState({ text: "" });

    event.preventDefault();
  };

  render() {
    const { text } = this.state;
    return (
      <div>
        <ReadItems
          fetcher={this.props.firebase.messages}
          render={({ loading, items: messages }) => (
            <Fragment>
              {loading && <div>Loading ...</div>}

              {messages ? (
                <MessageList messages={messages} />
              ) : (
                <div>There are no messages</div>
              )}
            </Fragment>
          )}
        />

        <AuthUserContext.Consumer>
          {authUser => (
            <form onSubmit={event => this.onCreateMessage(event, authUser)}>
              <input type="text" value={text} onChange={this.onChangeText} />
              <button type="submit">Send</button>
            </form>
          )}
        </AuthUserContext.Consumer>
      </div>
    );
  }
}

const MessageList = ({ messages }) => (
  <ul>
    {messages.map(message => (
      <MessageItem key={message.uid} message={message} />
    ))}
  </ul>
);

const MessageItem = ({ message }) => (
  <li>
    <strong>{message.userId}</strong> {message.text}
  </li>
);

const Messages = withFirebase(MessagesBase);

// broad-grained authorization, i.e. signin only
const condition = authUser => authUser !== null;

export default compose(
  withAuthorization(condition),
  withEmailVerification
)(Home);
