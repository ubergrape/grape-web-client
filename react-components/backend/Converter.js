import each from 'lodash/collection/each'

// TODO: remove caching and refactor class to simple function
// after old code from `src` folder will be refactored.
// Why we need caching: https://github.com/ubergrape/chatgrape/issues/3160

/**
 * Walk through given object or array only once using objects cache.
 * Convert object keys with `converter` funciton
 */
export default class Converter {
  constructor(obj, converter) {
    this.obj = obj
    this.converter = converter

    this.cache = []
  }

  isCircular(obj) {
    return this.cache.indexOf(obj) !== -1
  }

  convert() {
    const converted = this.circularConvert(this.obj)
    this.cache = []
    return converted
  }

  circularConvert(obj) {
    if (!obj || typeof obj !== 'object' || this.isCircular(obj)) return obj

    this.cache.push(obj)

    if (Array.isArray(obj)) return obj.map(item => this.circularConvert(item))
    if (obj.toJSON) return this.circularConvert(obj.toJSON())

    const newObj = {}
    each(obj, (val, key) => {
      let newVal = val
      if (typeof val === 'object') {
        newVal = this.circularConvert(val)
      }
      newObj[this.converter(key)] = newVal
    })
    return newObj
  }
}
