import stringify from './stringify'
import parse from './parse'

/**
 * Build a query object from a "non complete query" object to fill it with
 * default props.
 */
export default function build(query) {
  return parse(stringify(query))
}
