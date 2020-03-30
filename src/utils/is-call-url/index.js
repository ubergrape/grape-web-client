import parseUrl from 'grape-web/lib/parse-url'

import conf from '../../conf'

export default function isCallUrl(url) {
  const {
    server: { host },
    grapecall: { domains = [] },
  } = conf
  const urlObj = parseUrl(url)

  const isGrapeCallHost = domains.some(
    domain => parseUrl(domain).host === urlObj.host,
  )

  return (
    (urlObj.host === host || isGrapeCallHost) &&
    urlObj.pathname.indexOf('/call/') === 0
  )
}
