import startsWith from 'lodash/string/startsWith'
import includes from 'lodash/collection/includes'
import find from 'lodash/collection/find'
import get from 'lodash/object/get'
import {defineMessages} from 'react-intl'

/**
 * Returns rank based on match `key sub-string` and each `value string`.
 */
export function getRank(type, key, ...values) {
  let rank = 0

  if (!key) return rank

  const lKey = key.toLowerCase()
  values.some((value) => {
    const lValue = value.toLowerCase()
    if (lValue === lKey) {
      rank = 2
      return true
    }
    if (startsWith(lValue, lKey)) {
      rank = 1
      return true
    }
    return false
  })

  return rank
}

export function getEmojiSearchData(emoji, search) {
  return emoji.filter(search).map(smile => ({
    ...smile,
    rank: getRank('emoji', search, smile.name)
  }))
}

export function getUserSearchData(users, channelUsers, search) {
  const result = users.map((user) => {
    let name

    if (user.displayName) {
      name = user.displayName
    } else if (user.firstName) {
      name = user.firstName
      if (user.lastName) name += ` ${user.lastName}`
    } else {
      name = user.username
    }

    return {
      id: user.id,
      name,
      username: user.username,
      iconURL: user.avatar,
      inRoom: includes(channelUsers, user),
      rank: getRank('user', search, name, user.username),
      type: 'user'
    }
  })

  // Do the search.
  return result.filter(user =>
    user.name.toLowerCase().indexOf(search) >= 0 ||
    user.username.toLowerCase().indexOf(search) >= 0)
}


export function getRoomsSearchData(rooms, channel, search) {
  const result = rooms.map(({id, name, isPublic, slug}) => ({
    id,
    type: 'room',
    name,
    slug,
    isPrivate: !isPublic,
    rank: getRank('room', search, name),
    currentRoom: id === channel.id
  }))

  // Add current room as `@room` if its not a pm channel.
  if (channel.type === 'room') {
    const current = {
      ...find(result, 'currentRoom'),
      name: 'room',
      rank: 3
    }
    result.push(current)
  }

  // Do the search.
  return result.filter(room => room.name.toLowerCase().indexOf(search) >= 0)
}

function isImage(mime) {
  return String(mime).substr(0, 5) === 'image'
}

export function getImageAttachments(objects) {
  // Find embeddable images.
  const imageObjects = objects.filter(obj => isImage(obj.mimeType) && get(obj, 'detail.preview.embeddable'))

  const attachments = imageObjects.map((obj) => {
    const {image} = obj.detail.preview
    return {
      name: obj.name,
      url: obj.url,
      source: obj.service,
      mimeType: obj.mimeType,
      thumbnailUrl: image.url,
      thumbnailWidth: image.width,
      thumbnailHeight: image.height
    }
  })

  return attachments
}

const messages = defineMessages({
  quoteFooter: {
    id: 'quoteFooter',
    defaultMessage: '- [Message]({messageUrl}) from {author}',
    description: 'Quoted message footer text.'
  }
})

export const formatQuote = ({intl: {formatMessage}, message: {text, author, link}}) => {
  const quote = text
    .split('\n')
    .map(part => `> ${part}`)
    .join('\n')

  const footer = formatMessage(messages.quoteFooter, {
    messageUrl: link,
    author: author.name
  })

  return `\n\n${quote}\n\n${footer}`
}
