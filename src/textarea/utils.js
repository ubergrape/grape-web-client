export function getTokenUnderCaret(string, caretPostion) {
  const token = {
    text: '',
    position: []
  }

  const {position} = token

  while (position.length < 2) {
    let nextSymbolIndex = position.length ? caretPostion : caretPostion - 1
    let previousSymbolIndex = nextSymbolIndex
    let tailFound = false

    while (!tailFound) {
      if (string[nextSymbolIndex] === ' ' ||
          nextSymbolIndex < 0 ||
          nextSymbolIndex === string.length) {
        position.push(previousSymbolIndex)
        tailFound = true
        break
      }

      token.text = position.length ?
              token.text + string[nextSymbolIndex] :
              string[nextSymbolIndex] + token.text

      previousSymbolIndex = nextSymbolIndex
      nextSymbolIndex = position.length ? nextSymbolIndex + 1 : nextSymbolIndex - 1
    }
  }

  return Boolean(token.text) && token
}
