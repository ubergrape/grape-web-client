import encodeMDLink from '../encodeMDLink'
import buildLink from '../buildLink'

export default class Room {
  constructor(options) {
    this.id = options.id
    this.name = options.name
    this.slug = options.slug
    this.url = '/chat/' + this.name
    this.content = '@' + this.name
    this.service = 'chatgrape'
    this.type = 'chatgraperoom'
    this.str = this.toString()
  }

  toHTML() {
    return buildLink(this)
  }

  toString() {
    let url = `cg://chatgrape|room|${this.id}|/chat/${this.slug}`
    return `[${this.name}](${encodeMDLink(url)})`
  }
}
