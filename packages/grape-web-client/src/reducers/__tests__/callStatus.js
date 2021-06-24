import MockDate from 'mockdate'

import callStatus from '../callStatus'
import * as types from '../../constants/actionTypes'

import { cs1 } from './data/callStatus'

describe('callStatus reducer', () => {
  it('should handle HANDLE_JOINED_CALL', () => {
    MockDate.set('2019-08-19T06:16:18.464772+00:00')

    expect(
      callStatus(
        { show: false, timer: 0, data: {} },
        {
          type: types.HANDLE_JOINED_CALL,
          payload: cs1,
        },
      ),
    ).toEqual({
      show: true,
      timer: 60,
      data: cs1,
    })

    MockDate.reset()
  })

  it('should handle CLOSE_CALL_STATUS', () => {
    expect(
      callStatus(
        { show: true, timer: 1, data: cs1 },
        { type: types.CLOSE_CALL_STATUS },
      ),
    ).toEqual({
      show: false,
      timer: 0,
      data: {},
    })
  })

  it('should handle UPDATE_CALL_STATUS_TIMER', () => {
    expect(
      callStatus(
        { show: true, timer: 30, data: cs1 },
        { type: types.UPDATE_CALL_STATUS_TIMER, payload: 31 },
      ),
    ).toEqual({
      show: true,
      timer: 31,
      data: cs1,
    })
  })
})
