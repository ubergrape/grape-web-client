import find from 'lodash/collection/find'
import findLast from 'lodash/collection/findLast'
import isEmpty from 'lodash/lang/isEmpty'
import staticUrl from 'staticurl'

import reduxEmitter from '../legacy/redux-emitter'
import * as types from '../constants/actionTypes'
import * as api from '../utils/backend/api'
import {
  usersSelector, userSelector, channelsSelector, channelSelector, historySelector
} from '../selectors'
import {error} from './common'
import {showAlert, hideAlertByType} from './alert'
import * as alerts from '../constants/alerts'

function formatRegularMessage(msg, state) {
  const channels = channelsSelector(state)
  const users = usersSelector(state)

  const {id, text, userTime} = msg
  const time = new Date(msg.time)
  const type = 'regular'
  const fullAuthor = find(users, {id: msg.author.id})
  const author = {
    id: String(fullAuthor.id),
    name: fullAuthor.displayName
  }
  const {avatar} = fullAuthor
  const channel = find(channels, {id: msg.channel})
  const link = `${location.protocol}//${location.host}/chat/${channel.slug}/${id}`

  return {type, id, text, time, userTime, author, link, avatar, channel}
}

function formatActivityMessage(msg) {
  const {id} = msg
  const type = 'activity'
  const time = new Date(msg.time)
  const author = {
    id: String(msg.author.id),
    name: msg.author.username
  }
  const avatar = staticUrl(`images/service-icons/${author.id}-64.png`)
  const text = msg.title

  return {type, id, text, time, author, avatar}
}

function filterEmptyMessage(message) {
  return message.text.trim().length !== 0 || !isEmpty(message.attachments)
}

// https://github.com/ubergrape/chatgrape/wiki/Message-JSON-v2
function formatMessage(msg, state) {
  if (msg.author.type === 'service') {
    return formatActivityMessage(msg)
  }

  return formatRegularMessage(msg, state)
}

export function loadHistory(channelId, options) {
  return (dispatch, getState) => {
    dispatch({type: types.REQUEST_HISTORY})
    dispatch(showAlert({
      level: 'info',
      type: alerts.LOADING_HISTORY,
      delay: 1000
    }))
    api
      .loadHistory(channelId, options)
      .then(messages => {
        const state = getState()
        const payload = messages
          .reverse()
          .map(message => formatMessage(message, state))
          .filter(filterEmptyMessage)

        dispatch({
          type: types.HANDLE_LOADED_HISTORY,
          payload
        })
        dispatch(hideAlertByType(alerts.LOADING_HISTORY))
      })
      .catch(err => dispatch(error(err)))
  }
}

export function removeMessage({id: messageId}) {
  return (dispatch, getState) => {
    dispatch({type: types.REQUEST_REMOVE_MESSAGE})
    const {id: channelId} = channelSelector(getState())
    api
      .removeMessage(channelId, messageId)
      .catch(err => dispatch(error(err)))
  }
}

export function editMessage(msg) {
  return (dispatch) => {
    dispatch({
      type: types.EDIT_MESSAGE,
      payload: msg
    })
    reduxEmitter.editMessage(msg)
  }
}


export function editPreviousMessage() {
  return (dispatch, getState) => {
    const state = getState()
    const {messages} = historySelector(state)
    const user = userSelector(state)
    const msg = findLast(messages, msg => msg.author.id === String(user.id))
    dispatch(editMessage(msg))
  }
}


export function handleUpdateMessage(msg) {
  return (dispatch, getState) =>  {
    const state = getState()
    dispatch({
      type: types.UPDATE_MESSAGE,
      payload: formatMessage(msg, state)
    })
  }
}
