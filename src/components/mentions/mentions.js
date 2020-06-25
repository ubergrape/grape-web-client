import React from 'react'
import { FormattedMessage } from 'react-intl'
import SvgIcon from 'grape-web/lib/svg-icons/Icon'

import UserIcon from '../icon/Icon'

const getSvgIconName = ({ currentRoom, isPrivate }) => {
  if (currentRoom) return 'bell'
  return isPrivate ? 'lock' : 'comment'
}

function getRoomNote(item) {
  if (item.currentRoom) {
    return (
      <span>
        <FormattedMessage
          id="willNotifyRoom"
          description="*Describe willNotifyRoom*: this string is decribing action"
          defaultMessage="— notify everyone in this group"
        />
      </span>
    )
  }
  return (
    <span>
      <FormattedMessage
        id="wontNotifyRoom"
        description="*Describe wountNotifyRoom*: this string is decribing action"
        defaultMessage="— does not notify group members"
      />
    </span>
  )
}

/**
 * Change data for representation.
 */
export function map(originalData) {
  const data = originalData.map(originalItem => {
    const item = { ...originalItem }
    if (item.type === 'user') {
      const iconStyle = {
        backgroundImage: `url(${item.iconURL})`,
        borderRadius: '100%',
      }
      item.icon = <UserIcon name={item.name} style={iconStyle} />
      if (!item.inRoom) {
        item.note = (
          <span>
            — <FormattedMessage id="notInRoom" defaultMessage="not in room" />
          </span>
        )
      }
      return item
    }
    item.note = getRoomNote(item)
    item.icon = (
      <SvgIcon name={getSvgIconName(item)} style={{ height: '1.4em' }} />
    )
    return item
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
