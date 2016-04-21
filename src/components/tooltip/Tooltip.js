import React, {PropTypes} from 'react'
import style from './style'
import {useSheet} from 'grape-web/lib/jss'

function getPlacementStyles(arrowSize) {
  const margin = -(arrowSize / 2)
  const horizontalSizes = {
    width: arrowSize,
    height: arrowSize / 2
  }
  const verticalSizes = {
    width: arrowSize / 2,
    height: arrowSize
  }

  return {
    left: {
      ...verticalSizes,
      right: 1,
      marginTop: margin
    },
    right: {
      ...verticalSizes,
      left: 1,
      marginTop: margin
    },
    top: {
      ...horizontalSizes,
      bottom: 1,
      marginLeft: margin
    },
    bottom: {
      ...horizontalSizes,
      top: 1,
      marginLeft: margin
    }
  }
}

function Tooltip(props) {
  const {arrowSize, placement} = props
  const placementStyle = getPlacementStyles(arrowSize)[placement]
  const {
    sheet,
    theme,
    children,
    style: position,
    arrowOffsetLeft: left = placementStyle.left,
    arrowOffsetTop: top = placementStyle.top
  } = props

  return (
    <div
      className={`${sheet.classes.tooltip} ${theme.tooltip}`}
      style={position}>
      <i
        className={`${sheet.classes.arrow} ${theme.arrow}`}
        style={{ ...placementStyle, left, top}}>
        <i
          className={`${sheet.classes.pointer} ${theme.pointer}`}
          style={{width: arrowSize, height: arrowSize}} />
      </i>
      <div
        className={`${theme.body}`}
        style={{margin: arrowSize / 2}}>
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
  placement: PropTypes.string.isRequired,
  arrowOffsetLeft: PropTypes.string,
  arrowOffsetTop: PropTypes.string,
  children: PropTypes.element.isRequired
}

export default useSheet(Tooltip, style)
