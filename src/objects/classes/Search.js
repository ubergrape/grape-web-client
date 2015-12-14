import {getTrigger, encodeMDLink} from '../utils'

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
    this.name = trigger + result.name
    this.content = this.name
    this.str = this.toString()
  }

  toString() {
    const url = `cg://${this.service}|${this.type}|${this.name}|${this.url}||`
    return `[${this.name}](${encodeMDLink(url)})`
  }
}
