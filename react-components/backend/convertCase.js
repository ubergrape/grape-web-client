import each from 'lodash/collection/each'
import set from 'lodash/object/set'
import snakeCase from 'lodash/string/snakeCase'
import camelCase from 'lodash/string/camelCase'
import RecursiveIterator from 'recursive-iterator'

function convert2(obj, converter) {
  if (!obj) return obj
  const newObj = {}
  const iterable = new RecursiveIterator(obj, undefined, true)

  for (const {node, path, deep} of iterable) {
    const newPath = [
      ...path.slice(0, deep - 1),
      converter(path.pop())
    ]

    if (node && node.toJSON) {
      set(newObj, newPath, convert2(node.toJSON(), converter))
      continue
    }
    set(newObj, newPath, node)
  }

  return newObj
}

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
