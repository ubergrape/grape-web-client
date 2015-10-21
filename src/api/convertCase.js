import mapKeys from 'lodash/object/mapKeys'
import snakeCase from 'lodash/string/snakeCase'

/**
 * Converts all obj keys to snake case.
 */
export function toSnake(obj) {
  return mapKeys(obj, (val, key) => snakeCase(key))
}
