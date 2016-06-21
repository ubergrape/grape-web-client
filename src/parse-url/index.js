import pick from 'lodash/object/pick'

const parser = document.createElement('a')

const components = [
  'hash', 'host', 'hostname', 'href', 'pathname', 'port', 'protocol', 'search'
]

export default function parse(url) {
  parser.href = decodeURI(url)
  return pick(parser, components)
}
