import {getTrigger, encodeMDLink} from '../utils'
import {grapeProtocol} from '../constants'

const tokenType = 'search'
const trigger = getTrigger(tokenType)

export default class Search {
  constructor(result) {
    this.tokenType = tokenType
    this.result = result
    this.id = result.id
    this.service = result.service
    this.url = result.url
    this.type = result.type
    this.name = result.name
    this.originalName = result.originalName || this.name

    const {name} = this
    this.content = name[0] === '#' ? name : trigger + name

    this.str = this.toString()
  }

  toString() {
    const url = `${grapeProtocol}${this.service}|${this.type}|${this.id}|${this.url}||`
    return `[${this.originalName}](${encodeMDLink(url)})`
  }
}
