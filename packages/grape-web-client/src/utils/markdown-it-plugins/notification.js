// Converts markdown to a custom string representation for notifications.
const enabledTypes = ['text', 'emoji']

const reduceTokens = (state, tokens, currTokens = []) =>
  tokens.reduce((nextTokens, token) => {
    if (token.tag === 'br') {
      const newToken = new state.Token('text', '', 0)
      newToken.content = '\n'
      nextTokens.push(newToken)
    } else if (token.type === 'code_inline') {
      const newToken = new state.Token('text', '', 0)
      newToken.content = token.content
      nextTokens.push(newToken)
    } else if (enabledTypes.indexOf(token.type) !== -1) {
      nextTokens.push(token)
    } else if (token.children) {
      reduceTokens(state, token.children, nextTokens)
    }
    return nextTokens
  }, currTokens)

export default md => {
  md.core.ruler.push('notification', state => {
    // eslint-disable-next-line no-param-reassign
    state.tokens = reduceTokens(state, state.tokens)
  })
}
