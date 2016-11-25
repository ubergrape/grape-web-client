import renderautocomplete from './renderautocomplete';

// TODO: move this back to markdown.js but make it somehow accessible to the
// outside. we also need this in chatinput.js for editing messages

module.exports = function markdown_renderLink(href, title, text, asButton) {
    asButton = asButton || false
  let data = href.slice(5).split('|')

  let object = {
    id: "[" + text + '](' + href + ')',
    insert: text,
    service: data[0],
    type: data[1],
    url: data[3]
  }
  if (object.type === 'room') object.roomId = data[2]
  else object.userId = Number(data[2])

  return renderautocomplete(object, asButton)
}
