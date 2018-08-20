import channels from '../channels'
import * as types from '../../constants/actionTypes'

import { c1, c2, c3, c4 } from './data/channels'

describe('channels reducer', () => {
  it('should handle SET_CHANNELS', () => {
    expect(
      channels([], {
        type: types.SET_CHANNELS,
        payload: [c1, c2],
      }),
    ).toEqual([c1, c2])
  })

  it('should handle correct merge channels on SET_CHANNELS', () => {
    expect(
      channels([c1, c2], {
        type: types.SET_CHANNELS,
        payload: [c1, c3],
      }),
    ).toEqual([c2, c1, c3])
  })

  it('should handle correct update unread field on UPDATE_CHANNEL_UNREAD_COUNTER', () => {
    expect(
      channels([c4], {
        type: types.UPDATE_CHANNEL_UNREAD_COUNTER,
        payload: {
          id: 3339,
          unread: 0,
          time: 'Mon Oct 23 2017 17:36:08 GMT+0200',
        },
      }),
    ).toEqual([c2])
  })
})
