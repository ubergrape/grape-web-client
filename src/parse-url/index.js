import pick from 'lodash/object/pick'
import mapValues from 'lodash/object/mapValues'

const parser = document.createElement('a')

const components = [
  'hash', 'host', 'hostname', 'href', 'pathname', 'port', 'protocol', 'search'
]

export default function parse(url) {
  parser.href = encodeURI(url)
  return mapValues(
    pick(parser, components),
    component => decodeURIComponent(component)
  )
}
