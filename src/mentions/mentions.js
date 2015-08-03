import React from 'react'

import {jss} from '../jss'
import Icon from '../emoji/Icon'
import style from './style'

let sheet = jss.createStyleSheet(style).attach()

/**
 * Change data for representation.
 */
export function map(data) {
  data.forEach(item => {
    if (item.type === 'user') {
      let iconStyle = {
        backgroundImage: `url(${item.iconURL})`,
        borderRadius: '100%'
      }
      item.icon = <Icon name={item.name} style={iconStyle} />
      return
    }

    item.icon = <Icon name={item.name} className={'fa fa-comments ' + sheet.classes.icon}/>
  })

  return data
}
