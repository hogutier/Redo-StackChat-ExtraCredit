import React, { Component } from 'react';
import { connect } from 'react-redux';
import { postChannel } from '../store';

class NewChannelEntry extends Component {
  constructor() {
    super()
    this.state = {
      channelName: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleSubmit (event) {
    event.preventDefault()
    this.props.postChannel(this.state.channelName)
    this.setState({
      channelName: ''
    })
  }

  handleChange (event){
    this.setState({
      channelName: event.target.value
    })
  }

  render() {
    console.log("HISTORY PROPS", this.props)
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Create a Channel</label>
          <input
            className="form-control"
            type="text"
            name="channelName"
            value={this.state.channelName}
            onChange={this.handleChange}
            placeholder="Enter channel name" />
        </div>
        <div className="form-group">
          <button type="submit" className="btn btn-default">Create Channel</button>
        </div>
      </form>
    );
  }
  }

/** Write your `connect` component below! **/
const mapDispatchToProps = (dispatch, ownProps) => ({
  postChannel: (channelName) => dispatch(postChannel(channelName, ownProps.history))
})

export default connect(null, mapDispatchToProps)(NewChannelEntry)
