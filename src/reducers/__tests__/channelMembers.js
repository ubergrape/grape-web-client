import channelMembers from '../channelMembers'
import * as types from '../../constants/actionTypes'

import { m1, m2, m3, m4 } from './data/channelMembers'

describe('channelMembers reducer', () => {
  it('should handle HANDLE_CHANNEL_MEMBERS', () => {
    expect(
      channelMembers(
        { users: [], totalMembers: 0 },
        {
          type: types.HANDLE_CHANNEL_MEMBERS,
          payload: {
            users: [m1, m2],
            total: 4,
          },
        },
      ),
    ).toEqual({
      users: [m1, m2],
      totalMembers: 4,
    })
  })

  it('should handle correct changing of channel members on HANDLE_CHANNEL_MEMBERS', () => {
    expect(
      channelMembers(
        { users: [m1, m2], totalMembers: 4 },
        {
          type: types.HANDLE_CHANNEL_MEMBERS,
          payload: {
            users: [m1, m2, m3, m4],
            total: 4,
          },
        },
      ),
    ).toEqual({
      users: [m1, m2, m3, m4],
      totalMembers: 4,
    })
  })
})
