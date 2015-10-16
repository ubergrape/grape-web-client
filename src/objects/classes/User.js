import encodeMDLink from '../encodeMDLink'
import template from 'lodash/string/template'

// TODO Stop using global classes
let buildLink = template(`
  <a
    tabindex="-1"
    href="<%- url %>"
    data-object="<%- str %>"
    class="ac animate service-<%- service %> type-<%- type %>">
    <%- content %>
  </a>
`)

export default class User {
  constructor(options) {
    this.id = options.id
    this.username = options.username
    this.name = options.name
    this.url = '/chat/@' + this.username
    this.content = '@' + this.name
    this.service = 'chatgrape'
    this.type = 'chatgrapeuser'
    this.str = this.toString()
  }

  toHTML() {
    return buildLink(this)
  }

  toString() {
    let url = `cg://chatgrape|user|${this.id}|/chat/@${this.username}`
    return `[${this.name}](${encodeMDLink(url)})`
  }
}
