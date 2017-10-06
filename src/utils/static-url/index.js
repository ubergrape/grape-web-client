import warning from 'warning'

import conf from '../../conf'

export default function staticUrl(url) {
  const path = __STATIC_PATH__ || conf.server.staticPath
  warning(path, 'Static path is not defined %s.', url)
  return (path || '') + url
}
