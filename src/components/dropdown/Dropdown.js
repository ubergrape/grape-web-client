import React, {PropTypes} from 'react'
import {findDOMNode} from 'react-dom'
import Position from 'react-overlays/lib/Position'
import noop from 'lodash/utility/noop'

import RawTooltip from '../tooltip/Tooltip'
import listenOutsideClick from '../outside-click/listenOutsideClick'
import useTheme from '../theme/useTheme'

const Tooltip = listenOutsideClick(RawTooltip)

export default function Dropdown(props) {
  const {
    container,
    placement,
    target,
    children,
    theme,
    onOutsideClick,
    onClick
  } = props

  const StyledTooltip = useTheme(Tooltip, theme)
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
  theme: PropTypes.object.isRequired,
  target: PropTypes.instanceOf(Element),
  onOutsideClick: PropTypes.func,
  onClick: PropTypes.func
}

Dropdown.defaultProps = {
  placement: 'bottom',
  onOutsideClick: noop,
  onClick: noop
}
