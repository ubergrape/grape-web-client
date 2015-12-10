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
      return
    }
    const icon = item.isPrivate ? 'lock' : 'comments'
    item.icon = <Icon name={item.name} className={`fa fa-${icon} ${sheet.classes.icon}`}/>
  })

  return data
}
