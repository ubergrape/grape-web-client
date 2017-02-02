import React, {PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'

import {styles} from './tooltipTheme'
import {
  getPlacementStyles,
  getPointerPlacement,
  getBodyMargin
} from './utils'

function Tooltip(props) {
  const {
    sheet,
    theme,
    children,
    onClick,
    style: containerStyle,
    placement,
    arrowOffsetLeft,
    arrowOffsetTop
  } = props
  const {arrowSize, borderSize} = theme
  const placementStyle = getPlacementStyles(arrowSize, borderSize)[placement]
  const left = arrowOffsetLeft || placementStyle.left || theme.arrowOffsetLeft
  const top = arrowOffsetTop || placementStyle.top || theme.arrowOffsetTop
  const pointerStyle = {
    width: arrowSize,
    height: arrowSize,
    ...getPointerPlacement(placement)
  }
  const pointerContainerStyle = {...placementStyle, left, top}
  const bodyStyle = getBodyMargin(arrowSize, placement)

  return (
    <div
      onClick={onClick}
      className={`${sheet.classes.tooltip} ${theme.classes.tooltip || ''}`}
      style={containerStyle}
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
      <div
        className={`${theme.classes.body}`}
        style={bodyStyle}
      >
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
      body: PropTypes.string
    })
  }).isRequired,
  style: PropTypes.object,
  placement: PropTypes.string.isRequired,
  arrowOffsetLeft: offsetType,
  arrowOffsetTop: offsetType,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired
}

Tooltip.defaultProps = {
  style: null,
  arrowOffsetLeft: null,
  arrowOffsetTop: null,
  onClick: null
}

export default injectSheet(styles)(Tooltip)
