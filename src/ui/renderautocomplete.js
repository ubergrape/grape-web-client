let isWebkit = require('./iswebkit')

module.exports = renderAutocompleteItem

function getType(obj) {
  if (obj.roomId) {
    const room = window.ui.org.rooms.filter(room => room.id == obj.roomId)[0]
    if (room === window.ui.room) return 'notifyall'
    if (room && !room.is_public) return 'privateroom'
  }

  return obj.type
}

function renderAutocompleteItem(obj, asButton) {
  asButton = asButton || false
  let name = obj.id.replace(/"/g, '&quot;')

  if (asButton===true) {
    if (isWebkit()) {
      // Google Chrome and other webkit browser
      // Can only draw an inline icon within the <button> element.
      return '<button class="ac ' + obj.service + '" contenteditable="false" tabindex="-1" data-object="' + name + '" data-url="' + obj.url+ '"><span class="entry-type-icon type-' + obj.service + obj.type +'">&nbsp;</span>' + obj.insert + '</button>'
    } else {
      // Firefox, IE
      if (typeof obj.service !== "undefined" && obj.service === "emoji") {
        return '<button class="ac ' + obj.service + ' type-' + obj.service + obj.type +'" tabindex="-1" data-object="' + name + '">' + obj.insert + '</button>'
      } else {
        return '<input type="button" class="ac service-' + obj.service + ' type-' + obj.service + obj.type +'" tabindex="-1" data-object="' + name + '" data-url="' + obj.url+ '" value="' + obj.insert + '"/>'

      }
    }
  } else {
    let target = obj.service !== "chatgrape" ? 'target="_blank"' : ''
    return `<a class="ac service-${obj.service} type-${obj.service}${getType(obj)}" tabindex="-1" data-object="${name}" href="${ obj.url}" ${target}>${obj.insert}</a>`
  }
}
