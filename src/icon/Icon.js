import React, {Component, PropTypes} from 'react'
import {shouldPureComponentUpdate} from 'react-pure-render'

import {useSheet} from 'grape-web/lib/jss'
import style from './style'

/**
 * Styled icon component.
 */
@useSheet(style)
export default class Icon extends Component {
  static propTypes = {
    className: PropTypes.string,
    sheet: PropTypes.object.isRequired,
    style: PropTypes.object,
    name: PropTypes.string
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  render() {
    return (
      <i
        className={this.props.className || this.props.sheet.classes.icon}
        style={this.props.style}
        title={this.props.name}
        data-object={this.props.name}>
      </i>
    )
  }
}
