import axios from 'axios';
import { createStore, applyMiddleware } from 'redux';
import loggingMiddleware from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import socket from './socket';

// INITIAL STATE

const initialState = {
  messages: [],
  name: 'Reggie',
  newMessageEntry: '',
  channels: []
};

// ACTION TYPES

const UPDATE_NAME = 'UPDATE_NAME';
const GET_MESSAGE = 'GET_MESSAGE';
const GET_MESSAGES = 'GET_MESSAGES';
const WRITE_MESSAGE = 'WRITE_MESSAGE';
const GET_CHANNELS = 'GET_CHANNELS';
const RECEIVED_CHANNEL = 'RECEIVED_CHANNEL';

// ACTION CREATORS

export const receivedChannel = (channel) => ({
  type: RECEIVED_CHANNEL,
  channel
})

export const getChannels = (channels) => ({
  type: GET_CHANNELS,
  channels
})

export const updateName = (name) => {
  return { type: UPDATE_NAME, name };
}

export const getMessage = (message) => {
  return { type: GET_MESSAGE, message };
}

export const getMessages = (messages) => {
  return { type: GET_MESSAGES, messages };
}

export const writeMessage = (content) => {
  return { type: WRITE_MESSAGE, content };
}

// THUNK CREATORS

export const fetchMessages = () => {
  return async (dispatch) => {
    const response = await axios.get('/api/messages');
    const messages = response.data;
    const action = getMessages(messages);
    dispatch(action);
  }
}

export const postMessage = (message) => {
  return async (dispatch) => {
    const response = await axios.post('/api/messages', message);
    const newMessage = response.data;
    const action = getMessage(newMessage);
    dispatch(action);
    socket.emit('new-message', newMessage);
  }
}

export const fetchChannels = () => {
  return async (dispatch) => {
    const {data} = await axios.get('/api/channels')
    dispatch(getChannels(data))
  }
}

export const postChannel = (channel, history) => {
  return async (dispatch) => {
    const response = await axios.post('/api/channels', {name: channel})
    const newChannel = response.data
    dispatch(receivedChannel(newChannel))
    socket.emit('new-channel', newChannel)
    history.push(`/channels/${newChannel.id}`)
  }
}

// REDUCER

/**
 * Whoa! What is this { ...state } business?!?
 * This is the spread operator like we've seen before - but this time, we're using it with an Object!
 * When we use the spread operator on an object, it extracts all of the key-value pairs on that object into a new object!
 * Sound familiar? It acts like Object.assign!
 *
 * For example:
 *
 *    const obj1 = { a: 1 };
 *    const obj2 = { ...obj1, b: 2  }
 *    console.log(obj2) // { a: 1, b: 2 }
 *
 * This is the same result we would have gotten if we had said:
 *
 *    const obj2 = Object.assign({}, obj1, { b: 2 })
 *
 * However, it's much less verbose!
 * Is there anything the spread operator DOESN'T do?!?
 *
 * Note: this is still an experimental language feature (though it is on its way to becoming official).
 * We can use it now because we are using a special babel plugin with webpack (babel-preset-stage-2)!
 */
const reducer = (state = initialState, action) => {

  switch (action.type) {

    case UPDATE_NAME:
      return {
        ...state,
        name: action.name
      };

    case GET_MESSAGES:
      return {
        ...state,
        messages: action.messages
      };

    case GET_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.message]
      };

    case WRITE_MESSAGE:
      return {
        ...state,
        newMessageEntry: action.content
      };

    case GET_CHANNELS:
      return {
        ...state,
        channels: action.channels
      }

      case RECEIVED_CHANNEL:
        return {
          ...state,
          channels: [...state.channels, action.channel]
        }

    default:
      return state;
  }

}

const store = createStore(
  reducer,
  composeWithDevTools(applyMiddleware(
    thunkMiddleware,
    loggingMiddleware
  ))
);

export default store;
