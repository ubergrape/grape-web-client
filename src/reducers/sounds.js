import * as types from '../constants/actionTypes'
import {shouldNotify} from '../utils/notifications'

const initialState = {
  active: null
}

export default function reduce(state = initialState, action) {
  const {payload} = action

  switch (action.type) {
    case types.SET_CHANNEL:
      return {
        ...state,
        channel: payload.channel
      }
    case types.HANDLE_NOTIFICATION:
      const notify = shouldNotify({
        time: Date.now(),
        sourceChannelId: payload.channelId,
        currentChannelId: state.channel.id
      })

      if (!notify || !payload.sound) return state

      return {
        ...state,
        active: payload.dispatcher.includes('mention') ? 'mention' : 'messageIn'
      }
    case types.END_SOUND:
      return {...state, active: null}
    case types.HANDLE_OUTGOING_MESSAGE:
      return {...state, active: 'messageOut'}
    default:
      return state
  }
}
