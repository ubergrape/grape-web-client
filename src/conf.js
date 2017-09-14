import merge from 'lodash/object/merge'
import parseUrl from 'grape-web/lib/parse-url'

// Uses location.host if it matches the `url` host to avoid CORS issue
// when location.host contains org name.
const getSiteUrl = (url) => {
  if (!url) return null

  const {host: urlHost, protocol} = parseUrl(url)
  const {host: currHost} = location

  if (currHost.indexOf(urlHost) >= 0) {
    return `${protocol}//${currHost}`
  }

  return url
}

class Config {
  constants = {
    roles: {
      ROLE_USER: 0,
      ROLE_ADMIN: 1,
      ROLE_OWNER: 2
    }
  }
  user = {
    languageCode: 'en'
  }
  organization = {}
  forceLongpolling = false
  embed = null
  channelId = null
  server = {
    host: location.host,
    protocol: location.protocol,
    wsUrl: null,
    sentryJsDsn: null,
    siteUrl: null
  }
  container = '#grape-client'

  constructor() {
    this.setup({
      embed: Boolean(localStorage.embed),
      channelId: localStorage.channelId ? Number(localStorage.channelId) : null,
      forceLongpolling: Boolean(localStorage.forceLongpolling)
    })
  }

  setup(conf) {
    merge(this, conf)
    this.server.siteUrl = getSiteUrl(this.server.siteUrl)
  }
}

export default new Config()
