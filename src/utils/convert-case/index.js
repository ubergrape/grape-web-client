import { snakeCase, camelCase, isPlainObject, mapKeys, mapValues } from 'lodash'

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
