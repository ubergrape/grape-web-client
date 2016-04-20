import React, {PropTypes} from 'react'

const placementStyles = {
  left: { right: 0, marginTop: -3 },
  right: { left: 0, marginTop: -3 },
  top: { bottom: 0, marginLeft: -3 },
  bottom: { top: 0, marginLeft: -3 }
}


export default function Tooltip(props) {
  const placementStyle = placementStyles[props.placement]

  let {
    style,
    children,
    arrowOffsetLeft: left = placementStyle.left,
    arrowOffsetTop: top = placementStyle.top
  } = props

  return (
    <div style={{position: 'absolute', background: 'yellow', ...style}}>
      <div style={{position: 'absolute', background: 'green', width: '5px', height: '5px', ...placementStyle, left, top}} />
      <div style={{}}>
        {children}
      </div>
    </div>
  )
}
