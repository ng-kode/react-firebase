import React from "react";
import { compose } from "recompose";
import { withAuthorization, withEmailVerification } from "../Session";
import { withFirebase } from "../Firebase";

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
      loading: false,
      messages: [],
      text: ""
    };
  }

  componentDidMount() {
    this.setState({ loading: true });

    this.props.firebase.messages().on("value", snapshot => {
      const messageObject = snapshot.val();

      if (messageObject) {
        const messages = Object.keys(messageObject).map(key => ({
          ...messageObject[key],
          uid: key
        }));

        this.setState({
          messages,
          loading: false
        });
      } else {
        this.setState({ loading: false, messages: null });
      }
    });
  }

  componentWillUnmount() {
    this.props.firebase.messages().off();
  }

  onChangeText = event => {
    this.setState({ text: event.target.value });
  };

  onCreateMessage = event => {
    this.props.firebase.messages().push({
      text: this.state.text
    });

    this.setState({ text: "" });

    event.preventDefault();
  };

  render() {
    const { messages, loading, text } = this.state;
    return (
      <div>
        {loading && <div>Loading ...</div>}

        {messages ? (
          <MessageList messages={messages} />
        ) : (
          <div>There are no messages</div>
        )}

        <form onSubmit={this.onCreateMessage}>
          <input type="text" value={text} onChange={this.onChangeText} />
          <button type="submit">Send</button>
        </form>
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
