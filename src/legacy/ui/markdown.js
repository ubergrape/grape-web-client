let marked = require('marked')
let markdown_renderlink = require('./markdown_renderlink')
let emoji = require('./emoji')

let renderer = new marked.Renderer()
const {protocol, host} = window.location
const chatLinkRegExp = new RegExp(`^${protocol}//${host}/chat/`)

renderer.link_simple = function (href, title, text) {
  // Renderer.prototype.link, but with target blank
  const target = chatLinkRegExp.test(href) ? '' : 'target="_blank"'
  const _title = title ? `title="${title}"` : ''
  return `<a ${target} href="${href}" ${_title}>${text}</a>`
}
renderer.link = function (href, title, text) {
  if (this.options.sanitize) {
      try {
        let prot = decodeURIComponent(unescape(href))
          .replace(/[^\w:]/g, '')
          .toLowerCase()
      } catch (e) {
        href = ''
      }
    if (!href.match(/((mailto\:|cg\:|(news|(ht|f)tp(s?))\:\/){1}\S+)/)) href = ''
  }
  if (href.slice(0, 5) === "cg://")
    return markdown_renderlink(href, title, text)
  else
    return this.link_simple(href, title, text)
}
renderer.heading = function (text, level, raw) {
  // this is a hack, we should replace the markdown parser
  return (new Array(level+1)).join("#") + raw
}
renderer.hr = function () {
  return "--"
}
renderer.image = function (href, title, text) {
  let out = '<span class="markdown-img-wrapper">'
  out += '<img src="' + href + '" alt="' + text + '"'
  if (title) out += ' title="' + title + '"'
  out += this.options.xhtml ? '/>' : '>'
  out += '</span>'
  return out
}

marked.setOptions({
  renderer: renderer,
  sanitize: true,
  gfm: true,
  breaks: true,
  emoji: function (emo) {
    emoji.init_colons()
    // TODO: app.organization
    let custom_emojis = window.api.organization.custom_emojis
    if (custom_emojis.hasOwnProperty(emo)) {
      return '<img src="'+custom_emojis[emo]+'" class="emoji" alt="'+emo+'"/>'
    }
    let val = emoji.map.colons[emo]
    return val ? emoji.replacement(val, emo, ':') : ':' + emo + ':'
  }
})

module.exports = marked
