import conf from '../../conf'

export default function staticUrl(url) {
  const path = __STATIC_PATH__ || conf.server.staticPath
  return (path || '') + url
}
