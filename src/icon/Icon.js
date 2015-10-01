import React, {Component} from 'react'
import {shouldPureComponentUpdate} from 'react-pure-render'

import {useSheet} from '../jss'
import style from './style'

/**
 * Styled icon component.
 */
@useSheet(style)
export default class Icon extends Component {
  static defaultProps = {
    name: undefined,
    style: undefined,
    className: undefined
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  render() {
    return (
      // Space inside is required for webkit browsers. Otherwise icon won't get
      // removed by backspace within contenteditable. Precondition is some text before.
      <i
        className={this.props.className || this.props.sheet.classes.icon}
        style={this.props.style}
        title={this.props.name}
        data-object={this.props.name}>
        {' '}
      </i>
    )
  }
}
