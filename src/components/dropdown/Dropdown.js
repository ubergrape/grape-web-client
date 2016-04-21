import React, {PropTypes} from 'react'

import Position from 'react-overlays/lib/Position'
import Tooltip from '../tooltip/Tooltip'
import useTheme from '../theme/Theme'

function Dropdown({container, placement, target, children, theme}) {
  const StyledTooltip = useTheme(Tooltip, theme.classes)

  return (
    <Position
      container={container}
      placement={placement}
      target={target}>
        <StyledTooltip
          arrowSize={theme.arrowSize}
          placement={placement}>
            {children}
        </StyledTooltip>
    </Position>
  )
}

Dropdown.propTypes = {
  container: PropTypes.object.isRequired,
  placement: PropTypes.string,
  theme: PropTypes.object.isRequired,
  target: PropTypes.func.isRequired
}

Dropdown.defaultProps = {
  placement: 'bottom'
}

export default Dropdown
