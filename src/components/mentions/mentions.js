import React from 'react'
import {FormattedMessage} from 'react-intl'

import {jss} from 'grape-web/lib/jss'
import Icon from '../icon/Icon'
import style from './style'

const sheet = jss.createStyleSheet(style).attach()

function getIcon(item) {
  if (item.currentRoom) return 'bell'
  return item.isPrivate ? 'lock' : 'comments'
}

function getRoomNote(item) {
  if (item.currentRoom) {
    return (
      <span>
        <FormattedMessage
          id="willNotifyRoom"
          description="*Describe willNotifyRoom*: this string is decribing action"
          defaultMessage="— notify everyone in this room" />
      </span>
    )
  }
  return (
    <span>
      <FormattedMessage
        id="wontNotifyRoom"
        description="*Describe wountNotifyRoom*: this string is decribing action"
        defaultMessage="— does not notify room members" />
    </span>

  )
}

/**
 * Change data for representation.
 */
export function map(data) {
  data.forEach(item => {
    if (item.type === 'user') {
      const iconStyle = {
        backgroundImage: `url(${item.iconURL})`,
        borderRadius: '100%'
      }
      item.icon = <Icon name={item.name} style={iconStyle} />
      if (!item.inRoom) {
        item.note = (
          <span>
            —
            {' '}
            <FormattedMessage
              id="notInRoom"
              defaultMessage="not in room" />
          </span>
        )
      }
      return
    }
    item.note = getRoomNote(item)
    item.icon = <Icon name={item.name} className={`fa fa-${getIcon(item)} ${sheet.classes.icon}`}/>
  })

  data.sort((a, b) => {
    // Items with highest rank goes first
    if (a.rank > b.rank) return -1
    if (b.rank > a.rank) return 1

    // Channel names should be always after users.
    if (a.type !== 'user') return 1
    if (b.type !== 'user') return -1

    if (a.inRoom === b.inRoom) return 0

    // Users who has joined this room should be on top.
    return a.inRoom ? -1 : 1
  })

  return data
}
