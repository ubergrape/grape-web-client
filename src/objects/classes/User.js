import template from 'lodash/string/template'
import {getTrigger, encodeMDLink} from '../utils'

// TODO Stop using global classes
const buildLink = template(
  '<a ' +
    'tabindex="-1" ' +
    'href="<%- url %>" ' +
    'data-object="<%- str %>" ' +
    'class="ac animate service-<%- service %> type-<%- type %>">' +
    '<%- content %>' +
  '</a>'
)

const tokenType = 'user'
const trigger = getTrigger(tokenType)

export default class User {
  constructor(options) {
    this.tokenType = tokenType
    this.id = options.id
    this.username = options.username
    this.name = options.name
    this.url = '/chat/@' + this.username
    this.content = trigger + this.name
    this.service = 'chatgrape'
    this.type = 'chatgrapeuser'
    this.str = this.toString()
  }

  toHTML() {
    return buildLink(this)
  }

  toString() {
    const url = `cg://chatgrape|user|${this.id}|/chat/@${this.username}`
    return `[${this.name}](${encodeMDLink(url)})`
  }
}
