import { getTrigger, encodeMdLink } from '../utils'
import { grapeProtocol } from '../constants'

const tokenType = 'room'
const trigger = getTrigger(tokenType)

export default class Room {
  constructor(options) {
    this.tokenType = tokenType
    this.id = options.id
    this.slug = options.slug
    this.url = `/chat/${this.slug}`
    this.service = 'chatgrape'
    this.type = 'chatgraperoom'
    this.name = options.name
    this.nameWithoutTrigger = options.nameWithoutTrigger || this.name

    // prevent double `@@` in case when room name is `@room`
    const { nameWithoutTrigger } = this
    if (nameWithoutTrigger[0] === trigger) this.content = nameWithoutTrigger
    else this.content = trigger + nameWithoutTrigger

    this.str = this.toString()
  }

  toString() {
    const url = `${grapeProtocol}//chatgrape|room|${this.id}|${this.url}`
    return `[${this.name}](${encodeMdLink(url)})`
  }
}
