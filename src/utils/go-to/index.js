import parseUrl from 'grape-web/lib/parse-url'
import {matchPath} from 'react-router-dom'

import {channelRoute, pmRoute} from '../../constants/routes'

export default (pathOrUrl, options) => {
  const loginPath = '/accounts/login'
  const logoutPath = '/accounts/logout'
  const {
    onExternal, onRedirect, onSilentChange, onUpdateRouter, currChannel,
    mode, serviceUrl, replace
  } = options
  const {pathname, hostname} = parseUrl(pathOrUrl)
  if (hostname && hostname !== parseUrl(serviceUrl).hostname) {
    onExternal(pathOrUrl, 'grape')
    return
  }
  if (pathname === loginPath) {
    onRedirect(`${serviceUrl}${pathname}`)
    return
  }
  if (pathname === logoutPath) {
    if (mode === 'embedded') {
      onSilentChange(pathname, {})
      return
    }
    onRedirect(`${serviceUrl}${pathname}`)
    return
  }
  if (pathname.substr(0, 5) === '/chat') {
    const channelMatch = matchPath(pathname, {path: channelRoute})
    if (channelMatch) {
      const {channelId, messageId} = channelMatch.params
      if (Number(channelId) === currChannel) {
        if (!messageId) return
        if (mode === 'embedded') {
          onSilentChange(pathname, {
            channelId: Number(channelId),
            messageId
          })
          return
        }
        onUpdateRouter(pathname, 'push')
        return
      }
      if (mode === 'embedded') {
        onExternal(`${serviceUrl}${pathname}`, 'grape')
        return
      }
      onUpdateRouter(pathname, 'push')
      return
    }
    const pmMatch = matchPath(pathname, {path: pmRoute})
    if (pmMatch) {
      if (mode === 'embedded' || (hostname && mode !== 'full')) {
        onExternal(`${serviceUrl}${pathname}`, 'grape')
        return
      }
      if (hostname && mode === 'full') {
        onRedirect(`${serviceUrl}${pathname}`)
        return
      }
      onUpdateRouter(pathname, replace ? 'replace' : 'push')
      return
    }
    return
  }
  if (pathname === '/' || mode === 'full') {
    if (mode === 'embedded') {
      onExternal(`${serviceUrl}${pathname}`, 'grape')
      return
    }
    onRedirect(`${serviceUrl}${pathname}`)
    return
  }
  onExternal(`${serviceUrl}${pathname}`, 'grape')
}
