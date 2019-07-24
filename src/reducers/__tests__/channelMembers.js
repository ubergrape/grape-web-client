import channelMembers from '../channelMembers'
import * as types from '../../constants/actionTypes'

import { m1, m2, m3, m4 } from './data/channelMembers'

describe('channelMembers reducer', () => {
  it('should handle HANDLE_CHANNEL_MEMBERS', () => {
    expect(
      channelMembers(
        { users: [], isEveryMemberLoaded: false },
        {
          type: types.HANDLE_CHANNEL_MEMBERS,
          payload: {
            users: [m1, m2],
          },
        },
      ),
    ).toEqual({
      users: [m1, m2],
      isEveryMemberLoaded: false,
    })
  })

  it('should handle correct changing of channel members on HANDLE_CHANNEL_MEMBERS', () => {
    expect(
      channelMembers(
        { users: [m1, m2], isEveryMemberLoaded: false },
        {
          type: types.HANDLE_CHANNEL_MEMBERS,
          payload: {
            users: [m1, m2, m3, m4],
          },
        },
      ),
    ).toEqual({
      users: [m1, m2, m3, m4],
      isEveryMemberLoaded: false,
    })
  })

  it('should handle HANDLE_EVERY_MEMBER_LOADED', () => {
    expect(
      channelMembers(
        { users: [m1, m2, m3, m4], isEveryMemberLoaded: false },
        { type: types.HANDLE_EVERY_MEMBER_LOADED },
      ),
    ).toEqual({
      users: [m1, m2, m3, m4],
      isEveryMemberLoaded: true,
    })
  })
})
