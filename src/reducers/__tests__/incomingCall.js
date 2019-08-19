import incomingCall from '../incomingCall'
import * as types from '../../constants/actionTypes'

import { ic1 } from './data/incomingCall'

describe('incomingCall reducer', () => {
  it('should handle HANDLE_INCOMING_CALL', () => {
    expect(
      incomingCall(
        { show: false, incoming: {} },
        {
          type: types.HANDLE_INCOMING_CALL,
          payload: ic1,
        },
      ),
    ).toEqual({
      show: false,
      incoming: ic1,
    })
  })

  it('should handle SHOW_INCOMING_CALL', () => {
    expect(
      incomingCall(
        { show: false, incoming: ic1 },
        { type: types.SHOW_INCOMING_CALL },
      ),
    ).toEqual({
      show: true,
      incoming: ic1,
    })
  })

  it('should handle CLOSE_INCOMING_CALL', () => {
    expect(
      incomingCall(
        { show: true, incoming: ic1 },
        { type: types.CLOSE_INCOMING_CALL },
      ),
    ).toEqual({
      show: false,
      incoming: ic1,
    })
  })

  it('should handle CLEAR_INCOMING_CALL_DATA', () => {
    expect(
      incomingCall(
        { show: false, incoming: ic1 },
        { type: types.CLEAR_INCOMING_CALL_DATA },
      ),
    ).toEqual({
      show: false,
      incoming: {},
    })
  })
})
