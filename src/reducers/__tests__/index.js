import channels from '../channels'
import * as types from '../../constants/actionTypes'

import { c1, c2, c3 } from './data/channels'

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
})
