import history from '../history'
import {
  ADD_NEW_MESSAGE,
  CLEAR_HISTORY,
  REQUEST_NEWER_HISTORY,
  REQUEST_OLDER_HISTORY,
  UNSET_HISTORY_SCROLL_TO,
  UPDATE_MESSAGE,
  HANDLE_MORE_HISTORY,
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
          {},
          {
            type: ADD_NEW_MESSAGE,
            payload: {
              message: {
                channelId: 'bbb',
                id: 'bbb',
              },
              currentChannelId: 'aaa',
            },
          },
        ),
      ).toMatchSnapshot()
    })

    it('should set scrollTo if the author is the current user', () => {
      expect(
        history(
          {
            messages: [],
          },
          {
            type: ADD_NEW_MESSAGE,
            payload: {
              message: {
                id: 'msgId1',
                author: { id: 'userId1' },
                channelId: 'channelId1',
              },
              currentUserId: 'userId1',
              currentChannelId: 'channelId1',
            },
          },
        ),
      ).toMatchSnapshot()
    })

    it('should not set scrollTo if the author is a different user', () => {
      expect(
        history(
          {
            messages: [],
          },
          {
            type: ADD_NEW_MESSAGE,
            payload: {
              message: {
                id: 'msgId1',
                author: { id: 'userId2' },
                channelId: 'channelId1',
              },
              currentUserId: 'userId1',
              currentChannelId: 'channelId1',
            },
          },
        ),
      ).toMatchSnapshot()
    })

    it('should update the message based on the clientsideId and set the state of the message to sent', () => {
      expect(
        history(
          {
            messages: [
              { id: '234' },
              { clientsideId: 'abc' },
              { clientsideId: 'def' },
            ],
          },
          {
            type: ADD_NEW_MESSAGE,
            payload: {
              message: {
                id: '123',
                author: { id: 'userId2' },
                clientsideId: 'abc',
                channelId: 'channelId1',
              },
              currentUserId: 'userId1',
              currentChannelId: 'channelId1',
            },
          },
        ),
      ).toMatchSnapshot()
    })

    it('should add the new message if the clientsideId can not be found', () => {
      expect(
        history(
          {
            messages: [
              { id: '234' },
              { id: '345', clientsideId: 'abc' },
              { id: '456', clientsideId: 'def' },
            ],
          },
          {
            type: ADD_NEW_MESSAGE,
            payload: {
              message: {
                id: '123',
                author: { id: 'userId2' },
                clientsideId: 'xyz',
                channelId: 'channelId1',
              },
              currentUserId: 'userId1',
              currentChannelId: 'channelId1',
            },
          },
        ),
      ).toMatchSnapshot()
    })

    it('should add the new message if clientsideId is not available', () => {
      expect(
        history(
          {
            messages: [{ clientsideId: 'abc' }],
          },
          {
            type: ADD_NEW_MESSAGE,
            payload: {
              message: {
                id: '123',
                channelId: 'channelId1',
                author: { id: 'userId2' },
              },
              currentUserId: 'userId1',
              currentChannelId: 'channelId1',
            },
          },
        ),
      ).toMatchSnapshot()
    })
  })

  describe('HANDLE_MORE_HISTORY', () => {
    it('should remove duplicates for messages with same id', () => {
      expect(
        history(
          {
            messages: [{ id: '123' }, { id: '234' }, { id: '345' }],
          },
          {
            type: HANDLE_MORE_HISTORY,
            payload: { messages: [{ id: '123' }, { id: '456' }] },
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

  describe('CLEAR_HISTORY', () => {
    it('should reset messages and set loadedNewerMessage to false', () => {
      expect(history({}, { type: CLEAR_HISTORY })).toMatchSnapshot()
    })
  })

  describe('REQUEST_OLDER_HISTORY', () => {
    it('should add the payload promise to olderMessagesRequest and set loadedNewerMessage to false', () => {
      expect(
        history(
          {},
          {
            type: REQUEST_OLDER_HISTORY,
            payload: {
              promise: Promise.resolve({}),
            },
          },
        ),
      ).toMatchSnapshot()
    })
  })

  describe('REQUEST_NEWER_HISTORY', () => {
    it('should add the payload promise to newerMessagesRequest and set loadedNewerMessage to false', () => {
      expect(
        history(
          {},
          {
            type: REQUEST_NEWER_HISTORY,
            payload: {
              promise: Promise.resolve({}),
            },
          },
        ),
      ).toMatchSnapshot()
    })
  })
})
