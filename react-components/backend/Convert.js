import each from 'lodash/collection/each'

export default class Convert {
  constructor() {
    this.cache = []
  }

  run(obj, converter) {
    if (!obj || typeof obj !== 'object') return obj
    const {cache} = this
    if (cache.indexOf(obj) >= 0) return obj

    cache.push(obj)
    if (Array.isArray(obj)) return obj.map(item => this.run(item, converter))
    if (obj.toJSON) return this.run(obj.toJSON(), converter)

    const newObj = {}
    each(obj, (val, key) => {
      let newVal = val
      if (typeof val === 'object') {
        newVal = this.run(val, converter)
      }
      newObj[converter(key)] = newVal
    })
    return newObj
  }
}
