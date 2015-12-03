import each from 'lodash/collection/each'
import snakeCase from 'lodash/string/snakeCase'
import camelCase from 'lodash/string/camelCase'

/**
 * Converts all obj keys to snake case.
 */
export function toSnake(obj) {
  return convert(obj, snakeCase)
}

/**
 * Converts all obj keys to camel case.
 */
export function toCamel(obj) {
  return convert(obj, camelCase)
}

function convert(obj, converter) {
  if (typeof obj !== 'object') return obj
  if (Array.isArray(obj)) return obj.map(item => convert(item, converter))
  let newObj = {}
  each(obj, (val, key) => {
    let newVal = val
    if (Array.isArray(val)) newVal = convert(val, converter)
    newObj[converter(key)] = newVal
  })
  return newObj
}
