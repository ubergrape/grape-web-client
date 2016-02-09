import snakeCase from 'lodash/string/snakeCase'
import camelCase from 'lodash/string/camelCase'
import Convert from './Convert'


/**
 * Converts all obj keys to snake case.
 */
export function toSnake(obj) {
  return new Convert().run(obj, snakeCase)
}

/**
 * Converts all obj keys to camel case.
 */
export function toCamel(obj) {
  return new Convert().run(obj, camelCase)
}
