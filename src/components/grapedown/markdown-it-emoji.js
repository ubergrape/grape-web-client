/*
 * Custom Replica of the markdown-it-emoji index.js, but instead of using
 * the predefined list (full.json) we use the data coming from grape-emoji-js
 */
const emojiesDefs = require('markdown-it-emoji/lib/data/full.json')
const emojiesShortcuts = require('markdown-it-emoji/lib/data/shortcuts')
const emojiHtml = require('markdown-it-emoji/lib/render')
const emojiReplace = require('markdown-it-emoji/lib/replace')
const normalizeOpts = require('markdown-it-emoji/lib/normalize_opts')

module.exports = function emojiPlugin(md, options) {
  const defaults = {
    defs: emojiesDefs,
    shortcuts: emojiesShortcuts,
    enabled: [],
  }

  const opts = normalizeOpts(md.utils.assign({}, defaults, options || {}))

  // eslint-disable-next-line no-param-reassign
  md.renderer.rules.emoji = emojiHtml

  md.core.ruler.push(
    'emoji',
    emojiReplace(md, opts.defs, opts.shortcuts, opts.scanRE, opts.replaceRE),
  )
}
