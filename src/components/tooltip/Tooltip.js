import PropTypes from 'prop-types'
import React from 'react'
import injectSheet from 'grape-web/lib/jss'

import { styles } from './tooltipTheme'
import { getPlacementStyles, getPointerPlacement, getBodyMargin } from './utils'

function Tooltip(props) {
  const {
    sheet,
    theme,
    children,
    placement,
    arrowOffsetLeft,
    arrowOffsetTop,
    shift,
    className,
  } = props
  const { arrowSize, borderSize } = theme
  const placementStyle = getPlacementStyles(arrowSize, borderSize)[placement]
  const left = arrowOffsetLeft || placementStyle.left || theme.arrowOffsetLeft
  const top = arrowOffsetTop || placementStyle.top || theme.arrowOffsetTop
  const pointerStyle = {
    width: arrowSize,
    height: arrowSize,
    ...getPointerPlacement(placement),
  }
  const pointerContainerStyle = { ...placementStyle, left, top }
  const bodyStyle = getBodyMargin(arrowSize, placement)

  const { style } = props

  if (shift) {
    if (shift.left && style.left != null) style.left += shift.left
    if (shift.top > 0 && style.top != null) style.top += shift.top
  }

  return (
    <div
      className={`${sheet.classes.tooltip} ${theme.classes.tooltip || ''}`}
      style={style}
    >
      <i
        className={`${sheet.classes.arrow} ${theme.classes.arrow || ''}`}
        style={pointerContainerStyle}
      >
        <i
          className={`${sheet.classes.pointer} ${theme.classes.pointer}`}
          style={pointerStyle}
        />
      </i>
      <div className={`${className} ${theme.classes.body}`} style={bodyStyle}>
        {children}
      </div>
    </div>
  )
}

// Offset may be integer or `int%` string.
const offsetType = PropTypes.oneOfType([PropTypes.number, PropTypes.string])

Tooltip.propTypes = {
  sheet: PropTypes.object.isRequired,
  theme: PropTypes.shape({
    arrowSize: PropTypes.number,
    borderSize: PropTypes.number,
    arrowOffsetLeft: offsetType,
    arrowOffsetTop: offsetType,
    classes: PropTypes.shape({
      tooltip: PropTypes.string,
      arrow: PropTypes.string,
      pointer: PropTypes.string,
      body: PropTypes.string,
    }),
  }).isRequired,
  style: PropTypes.object,
  className: PropTypes.string,
  placement: PropTypes.oneOf(['top', 'left', 'right', 'bottom']),
  arrowOffsetLeft: offsetType,
  arrowOffsetTop: offsetType,
  children: PropTypes.node.isRequired,
  shift: PropTypes.shape({
    top: PropTypes.number,
    left: PropTypes.number,
  }),
}

Tooltip.defaultProps = {
  placement: 'right',
  shift: undefined,
  style: undefined,
  className: undefined,
  arrowOffsetLeft: undefined,
  arrowOffsetTop: undefined,
}

export default injectSheet(styles)(Tooltip)
