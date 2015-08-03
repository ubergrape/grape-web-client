import escape from 'lodash/string/escape'

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

  toHTML() {
    let url = escape(this.url)
    let service = escape(this.service)
    let type = escape(this.type)
    let object = escape(String(this))
    let content = escape(this.content)
    let result = escape(JSON.stringify(this.result))
    // TODO get rid of global classes.
    return `<a href="${url}" target="_blank" class="ac service-${service} type-${service}${type} animate" data-object="${object}" data-result="${result}" tabindex="-1">${content}</a>`
  }

  toString() {
    return `[${this.name}](cg://${this.service}|${this.type}|${this.id}|${this.url}||)`
  }
}
