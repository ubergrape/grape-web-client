import PropTypes from 'prop-types'
import React, {Component} from 'react'
import noop from 'lodash/utility/noop'
import {shouldPureComponentUpdate} from 'react-pure-render'

import injectSheet from 'grape-web/lib/jss'
import style from './style'

/**
 * Button component
 */
@injectSheet(style)
export default class Button extends Component {
  static propTypes = {
    text: PropTypes.string,
    className: PropTypes.string,
    onClick: PropTypes.func,
    sheet: PropTypes.object.isRequired
  }

  static defaultProps = {
    text: 'My Button',
    className: '',
    onClick: noop
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  render() {
    const {classes} = this.props.sheet
    return (
      <button
        onClick={this.props.onClick}
        className={`${classes.button} ${this.props.className}`}>
        {this.props.text}
      </button>
    )
  }
}
