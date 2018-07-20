import history from '../history'
import {
  ADD_NEW_MESSAGE,
  UNSET_HISTORY_SCROLL_TO,
} from '../../constants/actionTypes'

describe('history reducer', () => {
  it('should handle UNSET_HISTORY_SCROLL_TO', () => {
    expect(
      history(
        { scrollToAlignment: 'end', scrollTo: 'abc' },
        { type: UNSET_HISTORY_SCROLL_TO },
      ),
    ).toMatchSnapshot()
  })

  describe('ADD_NEW_MESSAGE', () => {
    it('should not update the state on a different channel', () => {
      expect(
        history(
          { channel: { id: 'aaa' } },
          { type: ADD_NEW_MESSAGE, payload: { channelId: 'bbb' } },
        ),
      ).toMatchSnapshot()
    })

    it('should set scrollTo if the author is the current user', () => {
      expect(
        history(
          { user: { id: 'userId1' }, channel: { id: 'channelId1' } },
          {
            type: ADD_NEW_MESSAGE,
            payload: {
              id: 'msgId1',
              author: { id: 'userId1' },
              channel: { id: 'channelId1' },
            },
          },
        ),
      ).toMatchSnapshot()
    })

    it('should not set scrollTo if the author is a different user', () => {
      expect(
        history(
          { user: { id: 'userId1' }, channel: { id: 'channelId1' } },
          {
            type: ADD_NEW_MESSAGE,
            payload: {
              id: 'msgId1',
              author: { id: 'userId2' },
              channel: { id: 'channelId1' },
            },
          },
        ),
      ).toMatchSnapshot()
    })
  })
})
