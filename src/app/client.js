import {create} from '../utils/backend/client'
import getBoundActions from './boundActions'

let client
let authIntervalId

const getClient = () => {
  if (!client) client = create()
  return client
}

export const connect = () => {
  const channel = getClient().connect()
  const {checkAuth} = getBoundActions()
  checkAuth()
  authIntervalId = setInterval(checkAuth, 5000)
  return channel
}

export const disconnect = () => {
  clearInterval(authIntervalId)
  getClient().disconnect()
}
