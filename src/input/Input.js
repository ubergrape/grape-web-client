import React, {Component} from 'react'
import {shouldPureComponentUpdate} from 'react-pure-render'

import {useSheet} from '../jss'
import style from './style'

@useSheet(style)
export default class Input extends Component {
  static defaultProps = {
    onInput: undefined,
    onKeyDown: undefined,
    delay: undefined,
    focused: false
  }

  constructor(props) {
    super(props)
    this.state = {
      focused: props.focused
    }
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  componentDidMount() {
    if (this.state.focused) this.focus()
  }

  componentWillReceiveProps(nextProps) {
    let {focused} = nextProps
    if (focused !== this.state.focused) {
      this.setState({focused})
    }
  }

  componentDidUpdate(prevProps, prevState) {
    let {focused} = this.state
    if (focused && prevState.focused !== focused) {
      this.focus()
    }
  }

  render() {
    let {classes} = this.props.sheet

    return (
      <input
        type="text"
        className={classes.input}
        ref="input"
        onChange={::this.onInputDebounced}
        onKeyDown={this.props.onKeyDown}
        onBlur={::this.onBlur} />
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

  onBlur() {
    this.setState({focused: false})
  }
}
