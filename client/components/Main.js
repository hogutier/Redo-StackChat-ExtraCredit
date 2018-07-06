import React, { Component } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import MessagesList from './MessagesList';
import NewChannelEntry from './NewChannelEntry';
import store, { fetchMessages, fetchChannels } from '../store';

class Main extends Component {

  componentDidMount () {
    this.props.fetchInitialMessages();
    this.props.fetchChannels();
  }

  render () {
    return (
      <div>
        <Sidebar />
        <Navbar />
        <main>
          <Switch>
            <Route path="/new-channel" component={NewChannelEntry} />
            <Route path="/channels/:channelId" component={MessagesList} />
            <Redirect to="/channels/1" />
          </Switch>
        </main>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchInitialMessages: () => dispatch(fetchMessages()),
    fetchChannels: () => dispatch(fetchChannels())
  }
}

export default withRouter(connect(null, mapDispatchToProps)(Main));
