import history from '../history'
import {
  ADD_NEW_MESSAGE,
  UNSET_HISTORY_SCROLL_TO,
  UPDATE_MESSAGE,
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
          { type: ADD_NEW_MESSAGE, payload: { channelId: 'bbb', id: 'bbb' } },
        ),
      ).toMatchSnapshot()
    })

    it('should set scrollTo if the author is the current user', () => {
      expect(
        history(
          {
            user: { id: 'userId1' },
            channel: { id: 'channelId1' },
            messages: [],
          },
          {
            type: ADD_NEW_MESSAGE,
            payload: {
              id: 'msgId1',
              author: { id: 'userId1' },
              channelId: 'channelId1',
            },
          },
        ),
      ).toMatchSnapshot()
    })

    it('should not set scrollTo if the author is a different user', () => {
      expect(
        history(
          {
            user: { id: 'userId1' },
            channel: { id: 'channelId1' },
            messages: [],
          },
          {
            type: ADD_NEW_MESSAGE,
            payload: {
              id: 'msgId1',
              author: { id: 'userId2' },
              channelId: 'channelId1',
            },
          },
        ),
      ).toMatchSnapshot()
    })

    it('should update the message based on the clientsideId and set the state of the message to sent', () => {
      expect(
        history(
          {
            user: { id: 'userId1' },
            messages: [
              { id: '234' },
              { clientsideId: 'abc' },
              { clientsideId: 'def' },
            ],
            channel: { id: 'channelId1' },
          },
          {
            type: ADD_NEW_MESSAGE,
            payload: {
              id: '123',
              author: { id: 'userId2' },
              clientsideId: 'abc',
              channelId: 'channelId1',
            },
          },
        ),
      ).toMatchSnapshot()
    })

    it('should add the new message if the clientsideId can not be found', () => {
      expect(
        history(
          {
            user: { id: 'userId1' },
            messages: [
              { id: '234' },
              { clientsideId: 'abc' },
              { clientsideId: 'def' },
            ],
            channel: { id: 'channelId1' },
          },
          {
            type: ADD_NEW_MESSAGE,
            payload: {
              id: '123',
              author: { id: 'userId2' },
              clientsideId: 'xyz',
              channelId: 'channelId1',
            },
          },
        ),
      ).toMatchSnapshot()
    })

    it('should add the new message if clientsideId is not available', () => {
      expect(
        history(
          {
            user: { id: 'userId1' },
            messages: [{ clientsideId: 'abc' }],
            channel: { id: 'channelId1' },
          },
          {
            type: ADD_NEW_MESSAGE,
            payload: {
              id: '123',
              channelId: 'channelId1',
              author: { id: 'userId2' },
            },
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
