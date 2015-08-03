import escape from 'lodash/string/escape'

export default class Room {
  constructor(options) {
    this.id = options.id
    this.name = options.name
    this.slug = options.slug
    this.url = '/chat/' + this.name
    this.content = '@' + this.name
  }

  toHTML() {
    let url = escape(this.url)
    let object = escape(String(this))
    let content = escape(this.content)

    // TODO get rid of global classes.
    return `<a href="${url}" class="ac service-chatgrape type-chatgraperoom animate" data-object="${object}" tabindex="-1">${content}</a>`
  }

  toString() {
    return `[${this.name}](cg://chatgrape|room|${this.id}|/chat/${this.slug})`
  }
}
