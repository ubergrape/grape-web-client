import each from 'lodash/collection/each'
import snakeCase from 'lodash/string/snakeCase'
import camelCase from 'lodash/string/camelCase'

export const cache = []

function convert(obj, converter) {
  if (!obj || typeof obj !== 'object') return obj
  if (cache.indexOf(obj) >= 0) return obj

  cache.push(obj)
  if (Array.isArray(obj)) return obj.map(item => convert(item, converter))
  if (obj.toJSON) return convert(obj.toJSON(), converter)

  const newObj = {}
  each(obj, (val, key) => {
    let newVal = val
    if (typeof val === 'object') {
      newVal = convert(val, converter)
    }
    newObj[converter(key)] = newVal
  })
  return newObj
}

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
