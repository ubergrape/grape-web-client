import { getTrigger, encodeMdLink } from '../utils'
import { grapeProtocol } from '../constants'

const tokenType = 'search'
const trigger = getTrigger(tokenType)

export default class Search {
  constructor(options) {
    this.tokenType = tokenType
    this.result = options
    this.id = options.id
    this.service = options.service
    this.url = options.url
    this.type = options.type
    this.name = options.name
    this.nameWithoutTrigger = options.nameWithoutTrigger || this.name

    // prevent double `##` in case when search is like `#331 Some Issue`
    const { nameWithoutTrigger } = this
    if (nameWithoutTrigger[0] === trigger) this.content = nameWithoutTrigger
    else this.content = trigger + nameWithoutTrigger

    this.str = this.toString()
  }

  toString() {
    const url = `${grapeProtocol}//${this.service}|${this.type}|${this.id}|${
      this.url
    }||`
    return `[${this.name}](${encodeMdLink(url)})`
  }
}
