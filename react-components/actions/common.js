import page from 'page'

import * as types from '../constants/actionTypes'
import {isMentioned, formatMessage} from './utils'
import omit from 'lodash/object/omit'
import find from 'lodash/collection/find'
import reduxEmitter from '../redux-emitter'
import {addSharedFiles, removeSharedFiles} from './sharedFiles'
import {addMention, removeMention} from './mentions'
import * as api from '../backend/api'
import {channelSelector, userSelector, usersSelector} from '../selectors'
import store from '../app/store'

export function setChannels(channels) {
  return {
    type: types.SET_CHANNELS,
    payload: channels
  }
}

export function setUsers(users) {
  return {
    type: types.SET_USERS,
    payload: users
  }
}

export function setOrg(org) {
  return {
    type: types.SET_ORG,
    payload: {
      org
    }
  }
}

export function setInitialData(org) {
  return dispatch => {
    dispatch(setUsers([...org.users]))
    dispatch(setChannels([...org.channels]))

    const cleanOrg = omit(org, 'users', 'channels', 'rooms', 'pms')
    dispatch(setOrg(cleanOrg))

    return dispatch({
      type: types.INITIAL_DATA_WAS_SET
    })
  }
}

export function setUser(user) {
  return {
    type: types.SET_USER,
    payload: {
      user
    }
  }
}

export function setChannel(channel) {
  return {
    type: types.SET_CHANNEL,
    payload: {
      channel
    }
  }
}

export function setSettings(settings) {
  return {
    type: types.SET_SETTINGS,
    payload: {
      settings
    }
  }
}

export function setSidebarIsLoading(isLoading) {
  return {
    type: types.SET_SIDEBAR_IS_LOADING,
    payload: {
      isLoading
    }
  }
}

export function handleNewMessage(message) {
  return dispatch => {
    const fMessage = formatMessage(message)
    if (fMessage.attachments.length) {
      dispatch(addSharedFiles(fMessage))
    }
    if (isMentioned(fMessage)) {
      dispatch(addMention(fMessage))
    }

    dispatch({
      type: types.NEW_MESSAGE,
      payload: {
        message: fMessage
      }
    })
  }
}

export function handleRemovedMessage({id}) {
  return dispatch => {
    dispatch(removeSharedFiles(id))
    dispatch(removeMention(id))
    dispatch({
      type: types.REMOVE_MESSAGE,
      payload: {
        messageId: id
      }
    })
  }
}

export function handleReadChannel(data) {
  const user = userSelector(store.getState())
  return {
    type: types.READ_CHANNEL,
    payload: {
      isCurrentUser: user.id === data.user,
      channelId: data.channel
    }
  }
}

export function goToMessage(message) {
  page(`/chat/${message.slug}/${message.id}`)
  return {
    type: types.GO_TO_MESSAGE,
    payload: {
      message
    }
  }
}

export function goToPayment() {
  location.pathname = '/payment'
  return {
    type: types.GO_TO_PAYMENT
  }
}

export function leaveChannel(channelId) {
  reduxEmitter.leaveChannel(channelId)
  return {
    type: types.LEAVE_CHANNEL
  }
}

export function goToChannel(slug) {
  page(`/chat/${slug}`)
  return {
    type: types.GO_TO_CHANNEL,
    payload: {
      slug
    }
  }
}

export function kickMemberFromChannel(params) {
  reduxEmitter.kickMemberFromChannel(params)
  return {
    type: types.KICK_MEMBER_FROM_CHANNEL
  }
}

export function showOrgInvite() {
  reduxEmitter.showOrgInvite()
  return {
    type: types.SHOW_ORG_INVITE
  }
}

export function handleNewChannel({channel}) {
  return {
    type: types.NEW_CHANNEL,
    payload: channel
  }
}

export function handleJoinedChannel({user: userId, channel: channelId}) {
  const users = usersSelector(store.getState())
  const user = find(users, ({id}) => id === userId)
  return {
    type: types.ADD_USER_TO_CHANNEL,
    payload: {
      channelId,
      user
    }
  }
}

export function handleLeftChannel({user: userId, channel: channelId}) {
  const users = usersSelector(store.getState())
  const user = find(users, ({id}) => id === userId)
  return {
    type: types.REMOVE_USER_FROM_CHANNEL,
    payload: {
      channelId,
      user
    }
  }
}

export function handleUpateChannel({channel}) {
  const {id, type, name, slug, description} = channel
  return {
    type: types.UPDATE_CHANNEL,
    payload: {
      id,
      type,
      name,
      slug,
      description
    }
  }
}

export function handleRemoveRoom({channel: id}) {
  return {
    type: types.REMOVE_ROOM,
    payload: id
  }
}

export function enableNotifications() {
  reduxEmitter.enableNotifications()
  // This action don't have reducer yet
  return {
    type: types.ENABLE_NOTIFICATIONS
  }
}

export function error(err) {
  reduxEmitter.showError(err)
  // This action don't have reducer yet
  return {
    type: types.ERROR,
    payload: error
  }
}

export function invitedToChannel(usernames, channelId) {
  return {
    type: types.INVITED_TO_CHANNEL,
    payload: {
      usernames,
      channelId
    }
  }
}

// This action isn't used yet, remove this comment after first use
/**
 * Run api request to join channel
 * response is handled at app/subscribe.js with action handleJoinedChannel
 */
export function joinChannel({id} = channelSelector(store.getState())) {
  return dispatch => {
    return api
      .joinChannel(id)
      .catch(err => dispatch(error(err)))
  }
}

// This action isn't used yet, remove this comment after first use
export function inviteToChannel(
  usernames,
  {id} = channelSelector(store.getState())
) {
  return dispatch => {
    return api
      .inviteToChannel(usernames, id)
      .then(() => dispatch(invitedToChannel(usernames, id)))
      .catch(err => dispatch(error(err)))
  }
}

export function showChannelsManager() {
  reduxEmitter.showChannelsManager()
  return {
    type: types.SHOW_CHANNELS_MANAGER
  }
}

export function showPMsManager() {
  reduxEmitter.showPMsManager()
  return {
    type: types.SHOW_PMS_MANAGER
  }
}
