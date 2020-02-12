import channels from '../channels'
import {
  SET_CHANNELS,
  UPDATE_CHANNEL_UNREAD_COUNTER,
} from '../../constants/actionTypes'

import { c1, c2, c3 } from './data/channels'

describe('channels reducer', () => {
  it('should handle SET_CHANNELS', () => {
    expect(
      channels([], {
        type: SET_CHANNELS,
        payload: [c1, c2],
      }),
    ).toMatchSnapshot()
  })

  it('should handle correct merge channels on SET_CHANNELS', () => {
    expect(
      channels([c1, c2], {
        type: SET_CHANNELS,
        payload: [c1, c3],
      }),
    ).toMatchSnapshot()
  })

  it('should handle correct update unread field on UPDATE_CHANNEL_UNREAD_COUNTER', () => {
    expect(
      channels([{ unread: 1 }], {
        type: UPDATE_CHANNEL_UNREAD_COUNTER,
        payload: {
          id: 3339,
          unread: 0,
          time: 'Mon Oct 23 2017 17:36:08 GMT+0200',
        },
      }),
    ).toMatchSnapshot()
  })

  it('should return same state if channel not found on UPDATE_CHANNEL_UNREAD_COUNTER', () => {
    expect(
      channels([{ unread: 1, id: 3338 }], {
        type: UPDATE_CHANNEL_UNREAD_COUNTER,
        payload: {
          id: 3339,
          unread: 0,
          time: 'Mon Oct 23 2017 17:36:08 GMT+0200',
        },
      }),
    ).toMatchSnapshot()
  })
})
