import escapeHTML from 'lodash/string/escape'
import encodeMDLink from '../encodeMDLink'

export default class Room {
  constructor(options) {
    this.id = options.id
    this.name = options.name
    this.slug = options.slug
    this.url = '/chat/' + this.name
    this.content = '@' + this.name
  }

  // TODO get rid of global classes.
  toHTML() {
    return `
      <a
        href="${escapeHTML(this.url)}"
        class="ac service-chatgrape type-chatgraperoom animate"
        data-object="${escapeHTML(String(this))}"
        tabindex="-1">
        ${escapeHTML(this.content)}
      </a>
    `
  }

  toString() {
    let url = `cg://chatgrape|room|${this.id}|/chat/${this.slug}`
    return `[${this.name}](${encodeMDLink(url)})`
  }
}
