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

const maxLevel = 5

function convert(obj, converter, level = -1) {
  if (!obj || typeof obj !== 'object') return obj
  level++
  if (Array.isArray(obj)) return obj.map(item => convert(item, converter, level))
  const json = obj.toJSON ? obj.toJSON() : obj
  let newObj = {}
  each(json, (val, key) => {
    let newVal = val
    if (typeof val === 'object' && level < maxLevel) {
      newVal = convert(val, converter, level)
    }
    newObj[converter(key)] = newVal
  })
  return newObj
}
