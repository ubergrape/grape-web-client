import React, {Component, PropTypes} from 'react'

import style from './style'
import {useSheet} from 'grape-web/lib/jss'
import Position from 'react-overlays/lib/Position'
import Tooltip from './Tooltip'

@useSheet(style)
export default class Dropdown extends Component {
  static propTypes = {
    sheet: PropTypes.object,
    target: PropTypes.func.isRequired
  }

  render() {
    return (
      <Position
        container={this.props.container}
        placement={this.props.placement}
        target={this.props.target}>
        <Tooltip>{this.props.children}</Tooltip>
      </Position>
    )
  }
}
