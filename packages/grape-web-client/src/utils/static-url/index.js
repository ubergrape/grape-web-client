import warning from 'warning'

import conf from '../../conf'

// This function should never be called before the config from the server is loaded.
export default function staticUrl(url) {
  const path = __STATIC_PATH__ || conf.server.staticPath
  warning(path, 'Static path is not defined for %s.', url)
  return (path || '') + url
}
