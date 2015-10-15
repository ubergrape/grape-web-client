import buildLink from '../buildLink'
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
    this.str = this.toString()
  }

  toHTML() {
    return buildLink({
      ...this,
      type: this.service + this.type
    })
  }

  toString() {
    let url = `cg://${this.service}|${this.type}|${this.id}|${this.url}||`
    return `[${this.name}](${encodeMDLink(url)})`
  }
}
