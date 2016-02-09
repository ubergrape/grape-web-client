import each from 'lodash/collection/each'

export default class Converter {
  constructor(obj, converter) {
    this.obj = obj
    this.converter = converter

    this.cache = []
  }

  isCircular(obj) {
    return this.cache.indexOf(obj) !== -1
  }

  convert(obj = this.obj, converter = this.converter) {
    if (!obj || typeof obj !== 'object' || this.isCircular(obj)) return obj

    this.cache.push(obj)

    if (Array.isArray(obj)) return obj.map(item => this.convert(item))
    if (obj.toJSON) return this.convert(obj.toJSON())

    const newObj = {}
    each(obj, (val, key) => {
      let newVal = val
      if (typeof val === 'object') {
        newVal = this.convert(val)
      }
      newObj[converter(key)] = newVal
    })
    return newObj
  }
}
