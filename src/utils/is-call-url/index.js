import parseUrl from 'grape-web/lib/parse-url'

import conf from '../../conf'

export default function isCallUrl(url) {
  const { host } = conf.server
  const urlObj = parseUrl(url)
  return urlObj.host === host && urlObj.pathname.indexOf('/call/jitsire/') !== 0
}
