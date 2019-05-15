import * as types from '../constants/actionTypes'
import { shouldNotify } from '../utils/notifications'

const initialState = {
  active: null,
  loop: false,
}

export default function reduce(state = initialState, action) {
  const { payload } = action

  switch (action.type) {
    case types.SET_CHANNEL:
      return {
        ...state,
        channel: payload.channel,
      }
    case types.HANDLE_NOTIFICATION: {
      const notify = shouldNotify({
        time: Date.now(),
        sourceChannelId: payload.channelId,
        currentChannelId: state.channel.id,
      })

      if (!notify || !payload.sound) return state

      return {
        ...state,
        active: payload.dispatcher.includes('mention')
          ? 'mention'
          : 'messageIn',
      }
    }
    case types.HANDLE_INCOMING_CALL: {
      return {
        ...state,
        active: 'incomingCall',
        loop: true,
      }
    }
    case types.END_SOUND:
      return { ...state, loop: false, active: null }
    case types.REQUEST_POST_MESSAGE:
      // Currently sounds for outgoing messages are disabled, because
      // we still have no setting for on/off for this.
      // return {...state, active: 'messageOut'}
      return state
    default:
      return state
  }
}
