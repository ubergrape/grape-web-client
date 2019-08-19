import callStatus from '../callStatus'
import * as types from '../../constants/actionTypes'

import { cs1 } from './data/callStatus'

describe('callStatus reducer', () => {
  it('should handle HANDLE_JOINED_CALL', () => {
    expect(
      callStatus(
        { show: false, timer: 0, call: {} },
        {
          type: types.HANDLE_JOINED_CALL,
          payload: cs1,
        },
      ),
    ).toEqual({
      show: true,
      timer: Math.floor(
        (Date.now() - Date.parse('2019-08-19T06:15:18.464772+00:00')) / 1000,
      ),
      call: cs1,
    })
  })

  it('should handle CLOSE_CALL_STATUS', () => {
    expect(
      callStatus(
        { show: true, timer: 1, call: cs1 },
        { type: types.CLOSE_CALL_STATUS },
      ),
    ).toEqual({
      show: false,
      timer: 0,
      call: {},
    })
  })

  it('should handle UPDATE_CALL_STATUS_TIMER', () => {
    expect(
      callStatus(
        { show: true, timer: 1, call: cs1 },
        { type: types.UPDATE_CALL_STATUS_TIMER },
      ),
    ).toEqual({
      show: true,
      timer: 2,
      call: cs1,
    })
  })
})
