import React from 'react'

import {jss} from 'grape-web/lib/jss'
import Icon from '../icon/Icon'
import style from './style'

const sheet = jss.createStyleSheet(style).attach()

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

    if (item.currentRoom) console.log(item)

    item.note = '(only a link, no notifications)'
    const icon = item.isPrivate ? 'lock' : 'comments'
    item.icon = <Icon name={item.name} className={`fa fa-${icon} ${sheet.classes.icon}`}/>
  })

  data.sort((a, b) => {
    if (a.type !== 'user') return 1
    if (b.type !== 'user') return -1
    if (a.inRoom === b.inRoom) return 0

    return a.inRoom ? -1 : 1
  })

  return data
}
