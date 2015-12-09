import {getTrigger, encodeMDLink} from '../utils'

const tokenType = 'room'
const trigger = getTrigger(tokenType)

export default class Room {
  constructor(options) {
    this.tokenType = tokenType
    this.id = options.id
    this.name = options.name
    this.slug = options.slug
    this.url = '/chat/' + this.name
    this.content = trigger + this.name
    this.service = 'chatgrape'
    this.type = 'chatgraperoom'
    this.str = this.toString()
  }

  toString() {
    const url = `cg://chatgrape|room|${this.id}|/chat/${this.slug}`
    return `[${this.name}](${encodeMDLink(url)})`
  }
}
