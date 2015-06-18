import React, {Component} from 'react'
import useSheet from 'react-jss'
import style from './style'

/**
 * Button component
 */
@useSheet(style)
export default class Button extends Component {
  static defaultProps = {
    text: 'My Button',
    className: '',
    onClick: undefined
  }

  render() {
    let {classes} = this.props.sheet
    return (
      <button
        onClick={this.props.onClick}
        className={`${classes.button} ${this.props.className}`}>
        {this.props.text}
      </button>
    )
  }
}
