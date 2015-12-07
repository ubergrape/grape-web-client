import template from 'lodash/string/template'
import {getTrigger, encodeMDLink} from '../utils'

// TODO Stop using global classes
const buildLink = template(
  '<a ' +
    'tabindex="-1" ' +
    'target="_blank" ' +
    'href="<%- url %>" ' +
    'data-object="<%- str %>" ' +
    'data-result="<%- result %>" ' +
    'class="ac animate service-<%- service %> type-<%- type %>">' +
    '<%- content %>' +
  '</a>'
)

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

  toHTML() {
    return buildLink({
      ...this,
      type: this.service + this.type,
      result: JSON.stringify(this.result)
    })
  }

  toString() {
    const url = `cg://${this.service}|${this.type}|${this.name}|${this.url}||`
    return `[${this.name}](${encodeMDLink(url)})`
  }
}
