import escapeHTML from 'lodash/string/escape'
import encodeMDLink from '../encodeMDLink'

export default class User {
  constructor(options) {
    this.id = options.id
    this.username = options.username
    this.name = options.name
    this.url = '/chat/@' + this.username
    this.content = '@' + this.name
  }

  // TODO get rid of global classes.
  toHTML() {
    return `
      <a
        href="${escapeHTML(this.url)}"
        class="ac service-chatgrape type-chatgrapeuser animate"
        data-object="${escapeHTML(String(this))}"
        tabindex="-1">
        ${escapeHTML(this.content)}
      </a>
    `
  }

  toString() {
    let url = `cg://chatgrape|user|${this.id}|/chat/@${this.username}`
    return `[${this.name}](${encodeMDLink(url)})`
  }
}
