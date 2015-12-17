import each from 'lodash/collection/each'
import snakeCase from 'lodash/string/snakeCase'
import camelCase from 'lodash/string/camelCase'

const maxLevel = 5

function convert(obj, converter, level = -1) {
  if (!obj || typeof obj !== 'object') return obj
  const nextLevel = level + 1
  if (Array.isArray(obj)) return obj.map(item => convert(item, converter, nextLevel))
  if (obj.toJSON) return convert(obj.toJSON(), converter, level)
  const newObj = {}
  each(obj, (val, key) => {
    let newVal = val
    if (typeof val === 'object' && nextLevel < maxLevel) {
      newVal = convert(val, converter, nextLevel)
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
