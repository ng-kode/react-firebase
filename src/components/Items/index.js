import React, { Component, Fragment } from "react";

export default class ReadItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      items: []
    };
  }

  componentDidMount() {
    this.setState({ loading: true });
    this.doGetItems();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.limit !== this.props.limit) {
      this.doGetItems();
    }
  }

  componentWillUnmount() {
    this.props.fetcher().off();
  }

  doGetItems = () => {
    this.props
      .fetcher()
      .orderByChild("createdAt")
      .limitToLast(this.props.limit || 5)
      .on("value", snapshot => {
        const itemsObject = snapshot.val();

        if (itemsObject) {
          this.setState({
            loading: false,
            items: Object.keys(itemsObject).map(key => ({
              ...itemsObject[key],
              uid: key
            }))
          });
        } else {
          this.setState({ loading: false, items: null });
        }
      });
  };

  render() {
    return <Fragment>{this.props.render(this.state)}</Fragment>;
  }
}
