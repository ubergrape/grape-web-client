import reject from 'lodash/reject'
import findIndex from 'lodash/findIndex'
import isNil from 'lodash/isNil'
import uniqBy from 'lodash/uniqBy'
import some from 'lodash/some'

import * as types from '../constants/actionTypes'
import conf from '../conf'

const initialState = {
  messages: [],
  minimumBatchSize: 40,
  loadedNewerMessage: false,
  scrollTo: null,
  scrollToAlignment: null,
  scrollTop: null,
  backendHasNewerMessages: true,
}

function updateMessage(state, newMessage) {
  const { messages } = state
  const newMessages = [...messages]
  const index = findIndex(newMessages, { id: newMessage.id })
  if (index === -1) return state
  const currMessage = newMessages[index]
  const message = { ...currMessage, ...newMessage }
  newMessages.splice(index, 1, message)
  return {
    ...state,
    messages: uniqBy([...newMessages], 'id'),
    loadedNewerMessage: false,
  }
}

/**
 * Mark last message as read, set `state` on all other messages to `undefined`
 * to remove the status mark.
 */
function markLastMessageAsRead(messages, senderId) {
  return messages.map((message, index) => {
    if (!message.state || message.author.id === senderId) return message
    return {
      ...message,
      state: index === messages.length - 1 ? 'read' : undefined,
    }
  })
}

export default function reduce(state = initialState, action) {
  const { payload } = action
  switch (action.type) {
    case types.SET_CHANNEL:
      return {
        ...state,
        selectedMessageId: payload.messageId,
        selectedMessageIdTimestamp: Date.now(),
        olderMessagesRequest: undefined,
        newerMessagesRequest: undefined,
        loadedNewerMessage: false,
        backendHasNewerMessages: true,
      }
    case types.HANDLE_INITIAL_HISTORY: {
      const {
        messages,
        scrollTo,
        scrollToAlignment,
        selectedMessageId,
        backendHasNewerMessages,
      } = payload
      return {
        ...state,
        messages,
        scrollTo,
        scrollToAlignment,
        selectedMessageId,
        backendHasNewerMessages,
        showNoContent: messages.length === 0 && !conf.embed,
        loadedNewerMessage: false,
      }
    }
    case types.HANDLE_MORE_HISTORY: {
      const {
        messages: newMessages,
        isScrollBack,
        backendHasNewerMessages,
      } = payload
      if (!newMessages.length && typeof backendHasNewerMessages !== 'boolean')
        return state

      let messages
      let loadedNewerMessage = false
      let { olderMessagesRequest, newerMessagesRequest } = state

      if (isScrollBack) {
        messages = [...newMessages, ...state.messages]
        olderMessagesRequest = undefined
      } else {
        messages = [...state.messages, ...newMessages]
        newerMessagesRequest = undefined
        loadedNewerMessage = true
      }

      return {
        ...state,
        messages: uniqBy(messages, 'id'),
        scrollTo: null,
        scrollToAlignment: null,
        olderMessagesRequest,
        newerMessagesRequest,
        loadedNewerMessage,
        showNoContent: false,
        backendHasNewerMessages:
          typeof backendHasNewerMessages === 'boolean'
            ? backendHasNewerMessages
            : state.backendHasNewerMessages,
      }
    }
    case types.GO_TO_CHANNEL:
      return { ...state, messages: [], loadedNewerMessage: false }
    // when the client is disconnected and re-connects SET_INITIAL_DATA_LOADING is triggered
    // to avoid unexpected behaviour from existing data this case resets the state
    case types.SET_INITIAL_DATA_LOADING:
      if (!payload) return state
      return initialState
    case types.REMOVE_ROOM:
      if (payload.channelId === payload.currentChannelId) {
        return initialState
      }
      return state
    case types.CLEAR_HISTORY:
      return {
        ...state,
        messages: [],
        loadedNewerMessage: false,
        backendHasNewerMessages: true,
      }
    case types.REQUEST_OLDER_HISTORY:
      return {
        ...state,
        olderMessagesRequest: payload.promise,
        loadedNewerMessage: false,
      }
    case types.REQUEST_NEWER_HISTORY:
      return {
        ...state,
        newerMessagesRequest: payload.promise,
        loadedNewerMessage: false,
      }
    case types.UNSET_HISTORY_SCROLL_TO:
      return {
        ...state,
        scrollTo: null,
        scrollToAlignment: null,
        loadedNewerMessage: false,
      }
    case types.SET_SCROLL_TOP:
      return {
        ...state,
        scrollTop: payload,
      }
    case types.REMOVE_MESSAGE:
      return {
        ...state,
        messages: uniqBy(reject(state.messages, { id: payload }), 'id'),
        loadedNewerMessage: false,
      }
    case types.EDIT_MESSAGE:
      return updateMessage(state, { ...payload, isSelected: true })
    case types.UPDATE_MESSAGE:
      return updateMessage(state, payload)
    case types.MARK_MESSAGE_AS_UNSENT:
      return updateMessage(state, { ...payload, state: 'unsent' })
    case types.RESEND_MESSAGE:
      return updateMessage(state, {
        ...payload,
        state: 'pending',
      })
    case types.MARK_CHANNEL_AS_READ: {
      // Currently backend logic is designed to mark all messages as read once
      // user read something in that channel.
      // This is not very accurate and might change in the future. So lets not couple
      // the rest of the logic with this design and use data structure which allows
      // individual messages to have different states.
      const { channelId, currentChannelId, isCurrentUser, userId } = payload
      if (channelId !== currentChannelId || isCurrentUser) {
        return state
      }

      return {
        ...state,
        messages: uniqBy(markLastMessageAsRead(state.messages, userId), 'id'),
        loadedNewerMessage: false,
      }
    }
    case types.REQUEST_POST_MESSAGE: {
      // Message was sent to a non-active channel. Happens for e.g. when
      // uploading files. Avoid a message flash in the wrong channel.
      if (payload.channelId !== payload.currentChannelId) {
        return state
      }
      // Do not append a message if the history is not up to date
      if (state.backendHasNewerMessages) return state

      return {
        ...state,
        // REQUEST_POST_MESSAGE is always triggered by the current user and thats
        // why we can scroll to the message (bottom of the chat) right away
        scrollTo: payload.id,
        scrollToAlignment: null,
        messages: uniqBy(
          [...state.messages, { ...payload, state: 'pending' }],
          'id',
        ),
        showNoContent: false,
        loadedNewerMessage: false,
      }
    }
    case types.ADD_NEW_MESSAGE: {
      const newMessage = payload.message

      if (newMessage.channelId !== payload.currentChannelId) return state
      // Do not append a message if the history is not up to date
      if (state.backendHasNewerMessages) return state

      const messages = [...state.messages]
      // this case occures when the message was added to the history
      // optimistically without waiting for a server response
      if (
        !isNil(newMessage.clientsideId) &&
        some(messages, msg => msg.clientsideId === newMessage.clientsideId)
      ) {
        const index = findIndex(messages, {
          clientsideId: newMessage.clientsideId,
        })
        const currMessage = messages[index]
        // state is changed to sent since after receiveing the message from
        // the server we can be sure it has been sent
        const message = { ...currMessage, ...newMessage, state: 'sent' }
        messages.splice(index, 1, message)
        return {
          ...state,
          scrollTo: null,
          scrollToAlignment: null,
          messages: uniqBy([...messages], 'id'),
          showNoContent: false,
          loadedNewerMessage: false,
        }
      }

      // If the message was added by the current user we are sure she/he has seen it and
      // we scroll to the new message (bottom of the chat)
      const scrollTo =
        newMessage.author.id === payload.currentUserId ? newMessage.id : null
      return {
        ...state,
        scrollTo,
        scrollToAlignment: null,
        messages: uniqBy([...messages, newMessage], 'id'),
        showNoContent: false,
        loadedNewerMessage: false,
      }
    }
    default:
      return state
  }
}
