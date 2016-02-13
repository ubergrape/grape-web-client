import {getTrigger, encodeMDLink} from '../utils'
import {grapeProtocol} from '../constants'

const tokenType = 'user'
const trigger = getTrigger(tokenType)

export default class User {
  constructor(options) {
    this.tokenType = tokenType
    this.id = options.id
    this.username = options.username
    this.url = options.url || `/chat/@${this.username}`
    this.service = 'chatgrape'
    this.type = 'chatgrapeuser'
    this.name = options.name
    this.nameWithoutTrigger = options.nameWithoutTrigger || this.name

    // prevent double `@@` in case when user name is `@User`
    const {nameWithoutTrigger} = this
    this.content = nameWithoutTrigger[0] === trigger ? nameWithoutTrigger : trigger + nameWithoutTrigger

    this.str = this.toString()
  }

  toString() {
    const url = `${grapeProtocol}chatgrape|user|${this.id}|${this.url}`
    return `[${this.name}](${encodeMDLink(url)})`
  }
}
