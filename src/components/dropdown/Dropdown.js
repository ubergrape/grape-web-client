import React, {PropTypes} from 'react'
import {findDOMNode} from 'react-dom'

import Position from 'react-overlays/lib/Position'
import Tooltip from '../tooltip/Tooltip'
import addClickOutside from '../click-outside/ClickOutside'
import useTheme from '../theme/Theme'

import noop from 'lodash/utility/noop'

function Dropdown(props) {
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
    addClickOutside(Tooltip, onClickOutside, onClick),
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

export default Dropdown
