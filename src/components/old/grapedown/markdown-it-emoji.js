/*
 * Custom Replica of the markdown-it-emoji index.js, but instead of using
 * the predefined list (full.json) we use the data coming from grape-emoji-js
 */
import emojiesShortcuts from 'markdown-it-emoji/lib/data/shortcuts'
import emojiHtml from 'markdown-it-emoji/lib/render'
import emojiReplace from 'markdown-it-emoji/lib/replace'
import normalizeOpts from 'markdown-it-emoji/lib/normalize_opts'
import jsEmoji from '../emoji/emoji'

export default function emojiPlugin(md, options) {
  const defaults = {
    defs: jsEmoji.map.colons,
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
