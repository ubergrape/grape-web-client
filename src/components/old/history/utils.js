import { pick, last, keyBy } from 'lodash'

/**
 * Merge message data with props to cover all rows representation cases.
 */
export const createRowsState = (() => {
  // Group messages under same avatar/name if they are send within this time distance.
  const timeThreshold = 5 * 60 * 1000

  function canGroup(message, prevMessage) {
    if (!message || !prevMessage) return false

    // Is not the same bot
    if (
      message.type === 'activity' &&
      (prevMessage.author.name !== message.author.name ||
        prevMessage.author.id !== message.author.id)
    )
      return false

    // Is not the same author
    if (
      message.type === 'regular' &&
      prevMessage.author.id !== message.author.id
    )
      return false

    if (message.attachments.length) return false

    if (prevMessage.attachments.length) return false

    // Group if within defined time threshold.
    return (
      Date.parse(prevMessage.time) + timeThreshold > Date.parse(message.time)
    )
  }

  function isSame(message, prevMessage) {
    if (!message || !prevMessage) return false
    const { text, docType } = message
    const { text: prevText, docType: prevDocType } = prevMessage
    if (docType === 'system' || prevDocType === 'system') return false
    return text === prevText
  }

  return (prevRows, messages, props) => {
    const prevRowsMap = keyBy(prevRows, 'id')

    const ret = messages.reduce(
      (result, message, index) => {
        const { rows, map } = result
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
          ...pick(
            props,
            'user',
            'colors',
            'customEmojis',
            'onEdit',
            'onRemove',
            'onResend',
            'onOpenPm',
            'selectedMessageId',
            'onCopyLink',
            'onPin',
            'onUnpin',
            'onQuote',
            'onRemoveLinkAttachment',
          ),
        })

        map[message.id] = message.id
        return result
      },
      { rows: [], map: {} },
    )

    if (ret.rows.length) last(ret.rows).isLast = true

    return ret
  }
})()
