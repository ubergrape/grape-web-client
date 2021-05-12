import { matchPath } from 'react-router-dom'

import { routes } from '../../router'
import parseUrl from '../../parse-url'

const onForeign = (pathOrUrl, { onExternal }) => {
  onExternal(pathOrUrl, '_blank')
}

const onSso = (pathOrUrl, options) => {
  const { onRedirect, onExternal, mode } = options
  if (mode === 'embedded') {
    onRedirect(pathOrUrl)
    return
  }
  onExternal(pathOrUrl, '_blank')
}

const onLogin = (pathOrUrl, options) => {
  const { serviceUrl, pathname, onRedirect } = options
  onRedirect(`${serviceUrl}${pathname}`)
}

const onLogout = (pathOrUrl, options) => {
  const { onSilentChange, onRedirect, mode, pathname, serviceUrl } = options
  if (mode === 'embedded') {
    onSilentChange(pathname, {})
    return
  }
  onRedirect(`${serviceUrl}${pathname}`)
}

const onPm = (pathOrUrl, options) => {
  const {
    onExternal,
    onRedirect,
    onSilentChange,
    mode,
    serviceUrl,
    hostname,
    pathname,
    pmMatch,
  } = options
  if (mode === 'embedded' || (hostname && mode !== 'full')) {
    onExternal(`${serviceUrl}${pathname}`, 'grape')
    return
  }
  if (hostname && mode === 'full') {
    onRedirect(`${serviceUrl}${pathname}`)
    return
  }
  onSilentChange(pathname, { mateId: pmMatch.params.mateId, type: 'pm' })
}

const onChannel = (pathOrUrl, options) => {
  const {
    onExternal,
    onSilentChange,
    onUpdateRouter,
    mode,
    serviceUrl,
    pathname,
    currChannel,
    channelMatch,
  } = options
  const { channelId, messageId } = channelMatch.params
  if (Number(channelId) === currChannel) {
    if (!messageId) return
    onSilentChange(pathname, {
      channelId: Number(channelId),
      messageId,
      type: 'channel',
    })
    return
  }
  if (mode === 'embedded') {
    onExternal(`${serviceUrl}${pathname}`, 'grape')
    return
  }
  onUpdateRouter(pathname, 'push')
}

const onChatPath = (pathOrUrl, options) => {
  const { onUpdateRouter, serviceUrl, mode, pathname, onExternal } = options
  if (mode === 'embedded') {
    onExternal(`${serviceUrl}${pathname}`, 'grape')
    return
  }
  onUpdateRouter(pathname, 'push')
}

const onChat = (pathOrUrl, options) => {
  const { pathname, hostname } = options
  const channelMatch = matchPath(pathname, { path: routes.channel })
  if (channelMatch) {
    onChannel(pathOrUrl, {
      ...options,
      channelMatch,
    })
    return
  }
  const pmMatch = matchPath(pathname, { path: routes.pm })
  if (pmMatch) {
    onPm(pathOrUrl, {
      ...options,
      hostname,
      pmMatch,
    })
  }
}

const onRootAndFull = (pathOrUrl, options) => {
  const { onExternal, onRedirect, mode, pathname, serviceUrl, search } = options
  if (mode === 'embedded') {
    onExternal(`${serviceUrl}${pathname}${search || ''}`, 'grape')
    return
  }
  onRedirect(`${serviceUrl}${pathname}${search || ''}`)
}

export default (pathOrUrl, options) => {
  const loginPath = '/accounts/login'
  const logoutPath = '/accounts/logout'
  const ssoPath = '/sso/sso'
  const { onExternal, mode, serviceUrl } = options
  const { pathname, hostname, search } = parseUrl(pathOrUrl)
  if (hostname && hostname !== parseUrl(serviceUrl).hostname) {
    onForeign(pathOrUrl, options)
    return
  }
  if (pathname === ssoPath) {
    onSso(pathOrUrl, { ...options })
    return
  }
  if (pathname === loginPath) {
    onLogin(pathOrUrl, { ...options, pathname })
    return
  }
  if (pathname === logoutPath) {
    onLogout(pathOrUrl, { ...options, pathname })
    return
  }
  if (pathname.substr(0, 5) === '/chat') {
    if (pathname === '/chat') {
      onChatPath(pathOrUrl, { ...options, hostname, pathname })
    }
    onChat(pathOrUrl, { ...options, hostname, pathname })
    return
  }
  if (pathname === '/' || mode === 'full') {
    onRootAndFull(pathOrUrl, { ...options, pathname, search })
    return
  }
  onExternal(`${serviceUrl}${pathname}${search || ''}`, 'grape')
}
