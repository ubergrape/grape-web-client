import startsWith from 'lodash/string/startsWith'
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


export function getRoomsAndUserSearchData(mentions, channel) {
  const result = mentions
    .map(({
      id,
      name,
      displayName,
      firstName,
      lastName,
      username,
      type,
      user,
      avatar,
      isPrivate,
      slug
    }, i) => {
      if (type === 'user') {
        let nameForUser

        if (displayName) {
          nameForUser = displayName
        } else if (firstName) {
          nameForUser = firstName
          if (lastName) nameForUser += ` ${lastName}`
        } else {
          nameForUser = username
        }

        return {
          id,
          name: nameForUser,
          username,
          iconURL: avatar,
          inRoom: channel.users.some(mention => mention.username === username),
          rank: mentions.length - (i + 1),
          type: 'user'
        }
      }

      return ({
        id,
        type: 'room',
        name,
        slug,
        isPrivate,
        rank: mentions.length - (i + 1),
        currentRoom: id === channel.id
      })
    })

  // Add current room as `@room` if its not a pm channel.
  if (channel.type === 'room') {
    const current = {
      id: channel.id,
      type: 'room',
      name: 'room',
      slug: channel.slug,
      isPrivate: !channel.isPublic,
      rank: 10,
      currentRoom: true
    }
    result.push(current)
  }

  return result
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
