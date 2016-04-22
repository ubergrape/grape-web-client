import React, {PropTypes} from 'react'
import {findDOMNode} from 'react-dom'
import Position from 'react-overlays/lib/Position'
import noop from 'lodash/utility/noop'

import Tooltip from '../tooltip/Tooltip'
import listenOutsideClick from '../outside-click/OutsideClick'
import useTheme from '../theme/Theme'

export default function Dropdown(props) {
  const {
    container,
    placement,
    target,
    children,
    theme,
    onClickOutside,
    onClick
  } = props

  const StyledTooltip = useTheme(
    listenOutsideClick(Tooltip, onClickOutside, onClick),
    theme.classes
  )
  return (
    <Position
      container={container}
      placement={placement}
      target={() => findDOMNode(target)}>
        <StyledTooltip
          arrowSize={theme.arrowSize}
          borderSize={theme.borderSize}
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
  onClickOutside: PropTypes.func,
  onClick: PropTypes.func
}

Dropdown.defaultProps = {
  placement: 'bottom',
  onClickOutside: noop,
  onClick: noop
}
