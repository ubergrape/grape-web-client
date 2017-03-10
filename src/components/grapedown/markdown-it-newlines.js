/* eslint-disable */

/**
 * This plugin finds two consecutive paragraphs and adds
 * a custom token `forcebreak` for every new line between
 * the two parapgrahs.
 */

module.exports = function (md) {
  md.core.ruler.after('block', 'forcebreak', plugin)

  function plugin(state) {
    for (let i=0; i < state.tokens.length - 3; i++) {
      const current = state.tokens[i]
      if (current.type !== 'paragraph_open') continue
      // skip 'inline' and 'paragraph_close'
      const next = state.tokens[i+3]
      if (next.type === 'paragraph_open') {
        const lineEndCurrent = current.map[1]
        const lineBeginNext = next.map[0]
        const diff = lineBeginNext - lineEndCurrent
        const token = new state.Token('forcebreak', 'br', 0);
        token.attrs = [ [ 'forcebreak', true ] ]
        state.tokens.splice(i + 3, 0, ...Array(diff).fill(token))
        // next run i will point to next 'paragraph_open' token.
        i += 2 + diff
      }
    }
  }
}
