// [Optional] Format @formatjs/cli structure to vendor's structure
const format = function(msgs) {
  return Object.keys(msgs).reduce(function(all, k) {
    const messages = all
    messages[k] = msgs[k].defaultMessage
    if (msgs[k].description) messages[`_${k}.comment`] = msgs[k].description
    return messages
  }, {})
}

exports.format = format

// [Optional] Format vendor's structure to @formatjs/cli structure
const compile = function(msgs) {
  return msgs
}
exports.compile = compile
