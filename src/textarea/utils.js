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
      let nextSymbol = string[nextSymbolIndex]

      if ((nextSymbol && nextSymbol.match(/\s/)) || // match whitespace and line break too
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

export function indexesOf(sub, str) {
    let startIndex = 0
    let index

    const subLen = sub.length

    const indices = []

    while ((index = str.indexOf(sub, startIndex)) > -1) {
        startIndex = index + subLen
        indices.push([index, startIndex])
    }
    return indices
}
