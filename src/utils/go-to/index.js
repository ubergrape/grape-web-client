import parseUrl from 'grape-web/lib/parse-url'
import {matchPath} from 'react-router-dom'

import {channelRoute} from '../../constants/routes'

export default (pathOrUrl, options) => {
  const loginPath = '/accounts/login'
  const logoutPath = '/accounts/logout'
  const {
    onExternal, onRedirect, onSilentChange, onUpdateRouter, currChannel,
    mode, serviceUrl
  } = options
  const {pathname} = parseUrl(pathOrUrl)
  if (pathname === loginPath) {
    onRedirect(`${serviceUrl}${pathname}`)
    return
  }
  if (pathname === logoutPath) {
    if (mode === 'embedded') {
      onSilentChange(pathname)
      return
    }
    onRedirect(`${serviceUrl}${pathname}`)
    return
  }
  if (pathname.substr(0, 5) === '/chat') {
    const {channelId, messageId} = matchPath(pathname, {path: channelRoute}).params
    if (Number(channelId) === currChannel) {
      if (!messageId) return
      if (mode === 'embedded') {
        onSilentChange(pathname)
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
  if (pathname === '/') {
    if (mode === 'embedded') {
      onExternal(`${serviceUrl}${pathname}`, 'grape')
      return
    }
    onRedirect(`${serviceUrl}${pathname}`)
    return
  }
  if (mode === 'full') {
    onRedirect(`${serviceUrl}${pathname}`)
    return
  }
  onExternal(`${serviceUrl}${pathname}`, 'grape')
}
