import PropTypes from 'prop-types'
import React, {Component} from 'react'
import {findDOMNode} from 'react-dom'
import Position from 'react-overlays/lib/Position'
import noop from 'lodash/utility/noop'
import listenOutsideClick from 'grape-web/lib/components/outside-click'

import GrayTooltip from '../tooltip/GrayTooltip'

const Tooltip = listenOutsideClick(GrayTooltip)

export default function Dropdown(props) {
  const {
    container,
    placement,
    target,
    shouldUpdatePosition,
    ...tooltipProps
  } = props

  return (
    <Position
      container={container}
      placement={placement}
      target={() => findDOMNode(target)}
      shouldUpdatePosition={shouldUpdatePosition}
    >
      <Tooltip {...tooltipProps} />
    </Position>
  )
}

Dropdown.propTypes = {
  container: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  target: PropTypes.oneOfType([
    PropTypes.instanceOf(Component),
    PropTypes.instanceOf(Element)
  ]).isRequired,
  placement: PropTypes.string,
  shouldUpdatePosition: PropTypes.bool,
  onOutsideClick: PropTypes.func
}

Dropdown.defaultProps = {
  placement: 'bottom',
  shouldUpdatePosition: false,
  onOutsideClick: noop
}
