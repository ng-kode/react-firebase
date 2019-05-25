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
      text: "",
      limit: 3
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

  onRemoveMessage = uid => {
    this.props.firebase.message(uid).remove();
  };

  onEditMessage = (message, text) => {
    const { uid, ...messageSnapshot } = message;

    this.props.firebase.message(uid).set({
      ...messageSnapshot,
      text
    });
  };

  onNextPage = () => {
    this.setState(state => ({ limit: state.limit + 5 }));
  };

  render() {
    const { text, limit } = this.state;
    return (
      <div>
        <ReadItems
          fetcher={this.props.firebase.messages}
          limit={limit}
          render={({ loading, items: messages }) => (
            <Fragment>
              {loading && <div>Loading ...</div>}

              {messages ? (
                <Fragment>
                  <MessageList
                    messages={messages}
                    onEditMessage={this.onEditMessage}
                    onRemoveMessage={this.onRemoveMessage}
                  />
                  <button type="button" onClick={this.onNextPage}>
                    More
                  </button>
                </Fragment>
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

const MessageList = ({ messages, onEditMessage, onRemoveMessage }) => (
  <ul>
    {messages.map(message => (
      <MessageItem
        key={message.uid}
        message={message}
        onEditMessage={onEditMessage}
        onRemoveMessage={onRemoveMessage}
      />
    ))}
  </ul>
);

class MessageItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: false,
      editText: this.props.message.text
    };
  }

  onToggleEditMode = () => {
    this.setState(state => ({
      editMode: !state.editMode,
      editText: this.props.message.text
    }));
  };

  onChangeEditText = event => {
    this.setState({ editText: event.target.value });
  };

  onSaveEditText = () => {
    this.props.onEditMessage(this.props.message, this.state.editText);
    this.setState({ editMode: false });
  };

  render() {
    const { message, onRemoveMessage } = this.props;
    const { editMode, editText } = this.state;

    return (
      <li>
        {editMode ? (
          <input
            type="text"
            value={editText}
            onChange={this.onChangeEditText}
          />
        ) : (
          <span>
            <strong>{message.userId}</strong> {message.text}
          </span>
        )}

        {!editMode && (
          <button type="button" onClick={() => onRemoveMessage(message.uid)}>
            Delete
          </button>
        )}

        {editMode ? (
          <span>
            <button onClick={this.onSaveEditText}>Save</button>
            <button onClick={this.onToggleEditMode}>Reset</button>
          </span>
        ) : (
          <button onClick={this.onToggleEditMode}>Edit</button>
        )}
      </li>
    );
  }
}

const Messages = withFirebase(MessagesBase);

// broad-grained authorization, i.e. signin only
const condition = authUser => authUser !== null;

export default compose(
  withAuthorization(condition),
  withEmailVerification
)(Home);
