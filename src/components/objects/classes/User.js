import {encodeMDLink} from '../utils'
import {grapeProtocol} from '../constants'

const tokenType = 'user'

export default class User {
  constructor(options) {
    this.tokenType = tokenType
    this.id = options.id
    this.username = options.username
    this.name = options.name
    this.url = options.url || `/chat/@${this.username}`
    this.content = this.name
    this.service = 'chatgrape'
    this.type = 'chatgrapeuser'
    this.str = this.toString()
  }

  toString() {
    const url = `${grapeProtocol}chatgrape|user|${this.id}|${this.url}`
    return `[${this.name}](${encodeMDLink(url)})`
  }
}
