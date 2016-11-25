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
    case types.PLAY_SOUND:
      const notify = shouldNotify({
        time: Date.now(),
        sourceChannelId: payload.message.channelId,
        currentChannelId: state.channel.id
      })

      if (!notify) return state

      return {
        ...state,
        active: payload.mentionsCount ? 'mention' : 'messageIn'
      }
    case types.END_SOUND:
      return {...state, active: null}
    case types.HANDLE_OUTGOING_MESSAGE:
      return {...state, active: 'messageOut'}
    default:
      return state
  }
}
