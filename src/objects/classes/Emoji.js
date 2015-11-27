import {replace} from '../../emoji'

export default class Emoji {
  constructor(options) {
    this.shortname = options.shortname
    this.content = options.shortname
  }

  toHTML() {
    return replace(this.shortname)
  }

  toString() {
    return this.shortname
  }
}
