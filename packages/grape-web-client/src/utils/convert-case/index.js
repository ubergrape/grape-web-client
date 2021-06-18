import snakeCase from 'lodash/snakeCase'
import camelCase from 'lodash/camelCase'
import isPlainObject from 'lodash/isPlainObject'
import mapKeys from 'lodash/mapKeys'
import mapValues from 'lodash/mapValues'

const mapKeysDeep = (object, callback) => {
  if (Array.isArray(object)) {
    return object.map(innerObject => mapKeysDeep(innerObject, callback))
  }

  if (isPlainObject(object)) {
    return mapValues(mapKeys(object, callback), value =>
      mapKeysDeep(value, callback),
    )
  }

  return object
}

/**
 * Converts all obj keys to snake case.
 */
export const toSnake = object =>
  mapKeysDeep(object, (value, key) => snakeCase(key))

/**
 * Converts all obj keys to camel case.
 */
export const toCamel = object =>
  mapKeysDeep(object, (value, key) => camelCase(key))
