import React, {PropTypes} from 'react'
import {findDOMNode} from 'react-dom'
import Position from 'react-overlays/lib/Position'
import noop from 'lodash/utility/noop'

import RawTooltip from '../tooltip/Tooltip'
import listenOutsideClick from '../outside-click/listenOutsideClick'
import useTheme from '../theme/useTheme'
import * as tooltipStyle from '../tooltip/themes/gray'

const Tooltip = listenOutsideClick(RawTooltip)
const StyledTooltip = useTheme(Tooltip, tooltipStyle)

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
        <StyledTooltip
          onOutsideClick={onOutsideClick}
          onClick={onClick}
          placement={placement}>
            {children}
        </StyledTooltip>
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
