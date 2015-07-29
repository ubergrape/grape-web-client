import React, {Component} from 'react'
import {shouldPureComponentUpdate} from 'react-pure-render'

import {useSheet} from '../jss'
import style from './style'

@useSheet(style)
export default class Input extends Component {
  static defaultProps = {
    onInput: undefined,
    onKeyDown: undefined,
    delay: undefined
  }

  constructor(props) {
    super(props)
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  componentDidMount() {
    this.focus()
  }

  render() {
    let {classes} = this.props.sheet

    return (
      <input
        type="text"
        className={classes.input}
        ref="input"
        onChange={::this.onInputDebounced}
        onKeyDown={this.props.onKeyDown} />
    )
  }

  focus() {
    return React.findDOMNode(this.refs.input).focus()
  }

  onInput(e) {
    let {value} = e.target
    this.props.onInput({value})
  }

  onInputDebounced(e) {
    let {delay} = this.props
    if (!delay) return this.onInput(e)
    clearTimeout(this.inputTimeoutId)
    this.inputTimeoutId = setTimeout(this.onInput.bind(this, e.nativeEvent), delay)
  }
}
