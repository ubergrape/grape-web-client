/**
 * This plugin finds two consecutive blocks and adds
 * a custom token `forcebreak` for every new line between
 * the two blocks.
 */

// Token starts a new block at root level.
const isRootBlockInit = b => b.level === 0 && b.block && b.nesting >= 0

function plugin(state) {
  for (let i = 0; i < state.tokens.length; i++) {
    if (isRootBlockInit(state.tokens[i])) {
      // Found block init token at root level.
      const current = state.tokens[i]

      // Find next block in root.
      let j
      let next
      for (j = i + 1; j < state.tokens.length; j++) {
        if (isRootBlockInit(state.tokens[j])) {
          next = state.tokens[j]
          break
        }
      }
      if (!next) break

      // Create `forcebreak` tokens for each line between the two blocks.
      const lineEndCurrent = current.map[1]
      const lineBeginNext = next.map[0]
      const diff = lineBeginNext - lineEndCurrent
      const token = new state.Token('forcebreak', 'br', 0)
      token.attrs = [['forcebreak', true]]
      state.tokens.splice(j, 0, ...Array(diff).fill(token))

      // On the next iteration `i` will point at the next `block` token.
      i = j + diff - 1
    }
  }
}

export default md => {
  // Run plugin after blocks have been tokenized.
  md.core.ruler.after('block', 'forcebreak', plugin)
}
