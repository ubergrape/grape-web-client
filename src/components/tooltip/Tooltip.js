import React, {PropTypes} from 'react'
import style from './style'
import {useSheet} from 'grape-web/lib/jss'
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
    style: position,
    placement
  } = props
  const {arrowSize, borderSize} = theme
  const placementStyle = getPlacementStyles(arrowSize, borderSize)[placement]
  const left = props.arrowOffsetLeft || placementStyle.left || theme.arrowOffsetLeft
  const top = props.arrowOffsetTop || placementStyle.top || theme.arrowOffsetTop

  return (
    <div
      onClick={onClick}
      className={`${sheet.classes.tooltip} ${theme.classes.tooltip || ''}`}
      style={position}>
      <i
        className={`${sheet.classes.arrow} ${theme.classes.arrow || ''}`}
        style={{...placementStyle, left, top}}>
        <i
          className={`${sheet.classes.pointer} ${theme.classes.pointer}`}
          style={{width: arrowSize, height: arrowSize, ...getPointerPlacement(placement)}} />
      </i>
      <div
        className={`${theme.classes.body}`}
        style={getBodyMargin(arrowSize, placement)}>
        {children}
      </div>
    </div>
  )
}

Tooltip.propTypes = {
  sheet: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  style: PropTypes.object,
  arrowSize: PropTypes.number,
  borderSize: PropTypes.number,
  placement: PropTypes.string,
  // Offset may be integer or `int%` string.
  arrowOffsetLeft: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  arrowOffsetTop: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired
}

export default useSheet(Tooltip, style)
