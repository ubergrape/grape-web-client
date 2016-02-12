import {getTrigger, encodeMDLink} from '../utils'
import {grapeProtocol} from '../constants'

const tokenType = 'room'
const trigger = getTrigger(tokenType)

export default class Room {
  constructor(options) {
    this.tokenType = tokenType
    this.id = options.id
    this.name = options.name
    this.slug = options.slug
    this.url = `/chat/${this.slug}`
    this.content = trigger + this.name
    this.service = 'chatgrape'
    this.type = 'chatgraperoom'
    this.str = this.toString()
  }

  toString() {
    const url = `${grapeProtocol}chatgrape|room|${this.id}|${this.url}`
    return `[${this.name}](${encodeMDLink(url)})`
  }
}
