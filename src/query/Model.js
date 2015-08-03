import stringify from './stringify'
import parse from './parse'

/**
 * A simplified model for query object.
 * Its designed to get notified if query has changed.
 */
export default class Model {
  constructor(options) {
    this.options = options
    this.reset()
  }

  set(key, value, opts = {}) {
    let attrs
    let options = opts

    // We only want to modify one key of the current attrs.
    if (typeof key == 'string') {
      this.attrs[key] = value
      attrs = this.attrs
    }
    else {
      attrs = key
      if (value) options = value
    }

    let hash = stringify(attrs)
    if (hash === this.hash) return false

    // Because parse will setup the object correctly.
    this.hash = hash
    this.attrs = parse(hash)
    if (!options.silent) this.options.onChange(hash)

    return true
  }

  get(name) {
    return this.attrs[name]
  }

  toJSON() {
    return this.attrs
  }

  reset() {
    this.attrs = parse('')
    this.hash = ''
  }

  isEmpty() {
    return !this.hash
  }
}
