const tokenType = 'emoji'

export default class Emoji {
  constructor(options) {
    this.tokenType = tokenType
    this.shortname = options.shortname
    this.content = options.shortname
    this.str = this.toString()
  }

  toString() {
    return this.shortname
  }
}
