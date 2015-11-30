import encodeMDLink from '../encodeMDLink'
import template from 'lodash/string/template'
import {getLabel} from '../utils'

// TODO Stop using global classes
let buildLink = template(
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

const label = getLabel('search')

export default class Search {
  constructor(result) {
    this.result = result
    this.id = result.id
    this.service = result.service
    this.url = result.url
    this.type = result.type
    this.name = result.name
    this.content = label + this.name
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
    let url = `cg://${this.service}|${this.type}|${this.id}|${this.url}||`
    return `[${this.name}](${encodeMDLink(url)})`
  }
}
