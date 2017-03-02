import React, {PropTypes} from 'react'
import {findDOMNode} from 'react-dom'
import Position from 'react-overlays/lib/Position'
import noop from 'lodash/utility/noop'
import listenOutsideClick from 'grape-web/lib/outside-click'

import GrayTooltip from '../tooltip/GrayTooltip'

const Tooltip = listenOutsideClick(GrayTooltip)

export default function Dropdown(props) {
  const {
    container,
    placement,
    target,
    children,
    onOutsideClick,
    onClick,
    shouldUpdatePosition
  } = props

  return (
    <Position
      container={container}
      placement={placement}
      target={() => findDOMNode(target)}
      shouldUpdatePosition={shouldUpdatePosition}
    >
      <Tooltip
        onOutsideClick={onOutsideClick}
        onClick={onClick}
        placement={placement}
      >
        {children}
      </Tooltip>
    </Position>
  )
}

Dropdown.propTypes = {
  container: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  target: PropTypes.instanceOf(Element).isRequired,
  placement: PropTypes.string,
  onOutsideClick: PropTypes.func,
  onClick: PropTypes.func,
  shouldUpdatePosition: PropTypes.bool
}

Dropdown.defaultProps = {
  placement: 'bottom',
  onOutsideClick: noop,
  onClick: noop,
  shouldUpdatePosition: false
}
