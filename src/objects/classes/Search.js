import escapeHTML from 'lodash/string/escape'
import encodeMDLink from '../encodeMDLink'

export default class Search {
  constructor(result) {
    this.result = result
    this.id = result.id
    this.service = result.service
    this.url = result.url
    this.type = result.type
    this.name = result.name
    this.content = this.name
  }

  // TODO get rid of global classes.
  toHTML() {
    let service = escapeHTML(this.service)
    let type = escapeHTML(this.type)
    return `
      <a tabindex="-1"
        target="_blank"
        href="${escapeHTML(this.url)}"
        data-object="${escapeHTML(String(this))}"
        data-result="${escapeHTML(JSON.stringify(this.result))}"
        class="ac service-${service} type-${service}${type} animate">
        ${escapeHTML(this.content)}
      </a>
    `.replace(/\n/g, '')
  }

  toString() {
    let url = `cg://${this.service}|${this.type}|${this.id}|${this.url}||`
    return `[${this.name}](${encodeMDLink(url)})`
  }
}
