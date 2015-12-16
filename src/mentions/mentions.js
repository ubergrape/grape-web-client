import React from 'react'

import {jss} from 'grape-web/lib/jss'
import Icon from '../icon/Icon'
import style from './style'

const sheet = jss.createStyleSheet(style).attach()

function getIcon(item) {
  if (item.currentRoom) return 'bell'
  return item.isPrivate ? 'lock' : 'comments'
}

function getRoomNote(item) {
  if (item.currentRoom) return 'notify everyone in this room'
  return '(only a link, no notifications)'
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
      if (!item.inRoom) item.note = '(not in room)'
      return
    }
    item.note = getRoomNote(item)
    item.icon = <Icon name={item.name} className={`fa fa-${getIcon(item)} ${sheet.classes.icon}`}/>
  })

  data.sort((a, b) => {
    // current room (mention all) always on top
    if (a.currentRoom) return -1
    if (b.currentRoom) return 1

    // not users (rooms) are always last
    if (a.type !== 'user') return 1
    if (b.type !== 'user') return -1

    if (a.inRoom === b.inRoom) return 0

    // move on top users that are in this room
    return a.inRoom ? -1 : 1
  })

  return data
}
