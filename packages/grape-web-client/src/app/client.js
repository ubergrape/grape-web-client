import { create } from '../utils/backend/client'
import getBoundActions from './boundActions'

let client

const get = () => {
  if (!client) client = create()
  return client
}

export const connect = () => {
  const channel = get().connect()
  const { checkAuth } = getBoundActions()
  checkAuth()
  return channel
}

export const reopen = () => {
  get().reopen()
}

export const open = () => {
  get().open()
}

export const disconnect = () => {
  get().disconnect()
}

export const pong = () => {
  get().pong()
}
