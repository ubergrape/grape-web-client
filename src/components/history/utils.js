import pick from 'lodash/object/pick'
import last from 'lodash/array/last'
import indexBy from 'lodash/collection/indexBy'

/**
 * Merge message data with props to cover all rows representation cases.
 */
export const createRowsState = (() => {
  // Group messages under same avatar/name if they are send within this time distance.
  const timeThreshold = 5 * 60 * 1000

  function canGroup(message, prevMessage) {
    if (!message || !prevMessage) return false

    // Is not the same author.
    if (prevMessage.author.id !== message.author.id) return false

    if (message.attachments.length) return false

    if (prevMessage.attachments.length) return false

    // Group if within defined time threshold.
    return prevMessage.time.getTime() + timeThreshold > message.time.getTime()
  }

  function isSame(message, prevMessage) {
    if (!message || !prevMessage) return false
    return message.text === prevMessage.text
  }

  return (prevRows, messages, props) => {
    const prevRowsMap = indexBy(prevRows, 'id')

    const ret = messages.reduce((result, message, index) => {
      const {rows, map} = result
      const prevMessage = messages[index - 1]
      const isGroupable = canGroup(message, prevMessage)
      const isDuplicate = isSame(message, prevMessage)

      // If it is a groupable duplicate, we don't render it as a separate message,
      // we just display a counter.
      if (isGroupable && isDuplicate) {
        const prevRow = rows[rows.length - 1]
        // We can mutate here because we previously created that object.
        // Render the last message we group.
        prevRow.duplicates.push(prevRow.id)
        prevRow.id = message.id
        prevRow.message = message
        // Point merged message to the row which will be rendered.
        map[message.id] = prevRow.id
        return result
      }

      rows.push({
        // Keep the previous state.
        ...prevRowsMap[message.id],
        id: message.id,
        message,
        prevMessage,
        isGroupable,
        isPm: props.channel.type === 'pm',
        isLast: false,
        duplicates: [],
        ...pick(props, 'user', 'channel', 'customEmojis', 'onEdit', 'onRemove', 'onResend', 'onMore',
          'onGoToChannel', 'selectedMessageId', 'onCopyLink', 'onQuote', 'onRemoveLinkAttachment')
      })

      map[message.id] = message.id
      return result
    }, {rows: [], map: {}})

    if (ret.rows.length) last(ret.rows).isLast = true

    return ret
  }
})()
