const parser = document.createElement('a')
const grapeProtocol = 'cg:'
const chatPath = '/chat'

export function isGrapeUrl(url) {
  parser.href = url
  return parser.protocol === grapeProtocol
}

export function isChatUrl(url) {
  const {host, pathname} = window.location
  parser.href = url
  return parser.host === host && pathname.indexOf(chatPath) === 0
}

export const nonStandardProps = ['user']
