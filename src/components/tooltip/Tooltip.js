import React, {PropTypes} from 'react'
import style from './style'
import {useSheet} from 'grape-web/lib/jss'
import {
  getPlacementStyles,
  getPointerPlacement,
  getBodyMargin
} from './utils'


function onClick(handler, e) {
  if (handler) handler(e)
}

function Tooltip(props) {
  const {arrowSize, borderSize, placement} = props
  const placementStyle = getPlacementStyles(arrowSize, borderSize)[placement]
  const {
    sheet,
    theme,
    children,
    style: position,
    arrowOffsetLeft: left = placementStyle.left,
    arrowOffsetTop: top = placementStyle.top,
    onClick: clickHandler
  } = props

  return (
    <div
      onClick={onClick.bind(null, clickHandler)}
      className={`${sheet.classes.tooltip} ${theme.tooltip}`}
      style={position}>
      <i
        className={`${sheet.classes.arrow} ${theme.arrow}`}
        style={{ ...placementStyle, left, top}}>
        <i
          className={`${sheet.classes.pointer} ${theme.pointer}`}
          style={{width: arrowSize, height: arrowSize, ...getPointerPlacement(placement)}} />
      </i>
      <div
        className={`${theme.body}`}
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
  arrowSize: PropTypes.number.isRequired,
  borderSize: PropTypes.number.isRequired,
  placement: PropTypes.string.isRequired,
  arrowOffsetLeft: PropTypes.string,
  arrowOffsetTop: PropTypes.string,
  onClick: PropTypes.func,
  children: PropTypes.node.isRequired
}

export default useSheet(Tooltip, style)
