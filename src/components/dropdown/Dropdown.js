import React, {PropTypes} from 'react'
import {findDOMNode} from 'react-dom'
import Position from 'react-overlays/lib/Position'
import noop from 'lodash/utility/noop'

import GrayTooltip from '../tooltip/GrayTooltip'
import listenOutsideClick from '../outside-click/listenOutsideClick'

const Tooltip = listenOutsideClick(GrayTooltip)
export default function Dropdown(props) {
  const {
    container,
    placement,
    target,
    children,
    onOutsideClick,
    onClick
  } = props

  return (
    <Position
      container={container}
      placement={placement}
      target={() => findDOMNode(target)}>
        <Tooltip
          onOutsideClick={onOutsideClick}
          onClick={onClick}
          placement={placement}>
            {children}
        </Tooltip>
    </Position>
  )
}

Dropdown.propTypes = {
  container: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  placement: PropTypes.string,
  target: PropTypes.instanceOf(Element),
  onOutsideClick: PropTypes.func,
  onClick: PropTypes.func
}

Dropdown.defaultProps = {
  placement: 'bottom',
  onOutsideClick: noop,
  onClick: noop
}
