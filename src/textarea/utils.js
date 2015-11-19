export function getWordUnderCaret(string, caretPostion) {
  function getWordTail(isBackward) {
    let tail = ''
    let nextSymbolIndex = isBackward ? caretPostion - 1 : caretPostion

    if (string[nextSymbolIndex] !== ' ') {
      let tailFound = false

      while (!tailFound) {
        if (string[nextSymbolIndex] === ' ' ||
            nextSymbolIndex < 0 ||
            nextSymbolIndex === string.length) {
          tailFound = true
          break
        }

        tail = isBackward ?
                string[nextSymbolIndex] + tail :
                tail + string[nextSymbolIndex]

        nextSymbolIndex = isBackward ? nextSymbolIndex - 1 : nextSymbolIndex + 1
      }
    }

    return tail
  }

  return getWordTail(true) + getWordTail()
}

