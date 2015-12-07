import encodeMDLink from '../encodeMDLink'
import template from 'lodash/string/template'
import {getLabel} from '../utils'

// TODO Stop using global classes
let buildLink = template(
  '<a ' +
    'tabindex="-1" ' +
    'href="<%- url %>" ' +
    'data-object="<%- str %>" ' +
    'class="ac animate service-<%- service %> type-<%- type %>">' +
    '<%- content %>' +
  '</a>'
)

const tokenType = 'room'
const label = getLabel(tokenType)

export default class Room {
  constructor(options) {
    this.tokenType = tokenType
    this.className = 'room'
    this.id = options.id
    this.name = options.name
    this.slug = options.slug
    this.url = '/chat/' + this.name
    this.content = label + this.name
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
