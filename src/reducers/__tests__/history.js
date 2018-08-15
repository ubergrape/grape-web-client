import history from '../history'
import {
  ADD_NEW_MESSAGE,
  UNSET_HISTORY_SCROLL_TO,
  UPDATE_MESSAGE,
  UPDATE_OPTIMISTICALLY_ADDED_MESSAGE,
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

  describe('UPDATE_OPTIMISTICALLY_ADDED_MESSAGE', () => {
    it('should update the message id based on the clientId and set the state to sent', () => {
      expect(
        history(
          {
            messages: [{ id: '234' }, { clientId: 'abc' }, { clientId: 'def' }],
          },
          {
            type: UPDATE_OPTIMISTICALLY_ADDED_MESSAGE,
            payload: { clientsideId: 'abc', message: { id: '123' } },
          },
        ),
      ).toMatchSnapshot()
    })

    it('should return the original state if the message is missing', () => {
      expect(
        history(
          {
            messages: [{ id: '234' }, { clientId: 'abc' }, { clientId: 'def' }],
          },
          {
            type: UPDATE_OPTIMISTICALLY_ADDED_MESSAGE,
            payload: { clientsideId: 'xyz', message: { id: '123' } },
          },
        ),
      ).toMatchSnapshot()
    })

    it('should return the original state if clientsideId is missing', () => {
      expect(
        history(
          { messages: [{ clientId: 'abc' }] },
          {
            type: UPDATE_OPTIMISTICALLY_ADDED_MESSAGE,
            payload: { message: { id: '123' } },
          },
        ),
      ).toMatchSnapshot()
    })
  })

  describe('UPDATE_MESSAGE', () => {
    it('should update the message', () => {
      expect(
        history(
          {
            messages: [
              { id: '123', text: 'Hello!' },
              { id: '234', text: 'Hello!!' },
              { id: '345', text: 'Hello!!!' },
            ],
          },
          {
            type: UPDATE_MESSAGE,
            payload: { id: '234', text: 'Hello World!' },
          },
        ),
      ).toMatchSnapshot()
    })

    it('should return the original state if the message is missing', () => {
      expect(
        history(
          {
            messages: [
              { id: '123', text: 'Hello!' },
              { id: '234', text: 'Hello!!' },
              { id: '345', text: 'Hello!!!' },
            ],
          },
          {
            type: UPDATE_MESSAGE,
            payload: { id: '999', text: 'Hello World!' },
          },
        ),
      ).toMatchSnapshot()
    })
  })
})
