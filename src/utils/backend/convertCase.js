import snakeCase from 'lodash/string/snakeCase'
import camelCase from 'lodash/string/camelCase'
import Converter from './Converter'


/**
 * Converts all obj keys to snake case.
 */
export function toSnake(obj) {
  return new Converter(obj, snakeCase).convert()
}

/**
 * Converts all obj keys to camel case.
 */
export function toCamel(obj) {
  return new Converter(obj, camelCase).convert()
}
