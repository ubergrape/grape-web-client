import React, {PropTypes} from 'react'
import capitalize from 'lodash/string/capitalize'

import style from './HoverTooltipStyle'
import {useSheet} from 'grape-web/lib/jss'
import BlackTooltip from '../tooltip/BlackTooltip'
import * as styles from '../tooltip/themes/black'

function Tooltip({sheet: {classes}, message, children, align, placement}) {
  if (!message) return null

  let arrowOffsetLeft
  switch (align) {
    case 'center':
      arrowOffsetLeft = '50%'
      break
    case 'left':
      arrowOffsetLeft = '15'
      break
    case 'right':
      arrowOffsetLeft = 'calc(100% - 15px)'
      break
    default:
  }

  const position = styles[placement + capitalize(align)]
  return (
    <div>
      <span className={classes.trigger}>
        {children}
      </span>
      <div className={classes.tooltip}>
        <BlackTooltip
          style={position}
          arrowOffsetLeft={arrowOffsetLeft}
          placement={placement}>
          {message}
        </BlackTooltip>
      </div>
    </div>
  )
}

Tooltip.propTypes = {
  message: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
  sheet: PropTypes.object.isRequired,
  align: PropTypes.string.isRequired,
  placement: PropTypes.string.isRequired
}

Tooltip.defaultProps = {
  align: 'center',
  placement: 'bottom'
}

export default useSheet(Tooltip, style)
