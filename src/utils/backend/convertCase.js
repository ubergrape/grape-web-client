import snakeCase from 'lodash/string/snakeCase'
import camelCase from 'lodash/string/camelCase'
import isObject from 'lodash/lang/isObject'
import mapKeys from 'lodash/object/mapKeys'
import mapValues from 'lodash/object/mapValues'

const mapKeysDeep = (object, callback) => {
  if (Array.isArray(object)) {
    return object.map(innerObject => mapKeysDeep(innerObject, callback))
  }

  if (isObject(object)) {
    return mapValues(
        mapKeys(object, callback),
        value => mapKeysDeep(value, callback)
      )
  }

  return object
}

/**
 * Converts all obj keys to snake case.
 */
export const toSnake = object => (
  mapKeysDeep(object, (value, key) => snakeCase(key))
)

/**
 * Converts all obj keys to camel case.
 */
export const toCamel = object => (
   mapKeysDeep(object, (value, key) => camelCase(key))
 )
