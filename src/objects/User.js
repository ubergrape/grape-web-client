import escape from 'lodash/string/escape'

export default class User {
  constructor(options) {
    this.id = options.id
    this.username = options.username
    this.name = options.name
    this.url = '/chat/@' + this.username
    this.content = '@' + this.name
  }

  toHTML() {
    let url = escape(this.url)
    let object = escape(String(this))
    let content = escape(this.content)

    // TODO get rid of global classes.
    return `<a href="${url}" class="ac service-chatgrape type-chatgrapeuser animate" data-object="${object}" tabindex="-1">${content}</a>`
  }

  toString() {
    return `[${this.name}](cg://chatgrape|user|${this.id}|/chat/@${this.username})`
  }
}
