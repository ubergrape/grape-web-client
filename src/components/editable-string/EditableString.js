import React, {Component, PropTypes} from 'react'

import keyname from 'keyname'

import style from './style'
import {useSheet} from 'grape-web/lib/jss'

@useSheet(style)
export default class EditableString extends Component {
  static propTypes = {
    sheet: PropTypes.object,
    onSave: PropTypes.func,
    multiline: PropTypes.bool,
    value: PropTypes.string,
    placeholder: PropTypes.string
  }

  static defaultProps = {
    value: ''
  }

  constructor(props) {
    super(props)
    this.state = {
      value: props.value
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.state.value) {
      this.setState({value: nextProps.value}, () => {
        this.refs.input.blur()
      })
    }
  }

  onChange({target}) {
    this.setState({value: target.value})
  }

  onFocus() {
    this.setState({focused: true})
  }

  onBlur() {
    if (this.state.preventBlur) {
      this.refs.input.focus()
      return
    }
    this.setState({
      focused: false,
      value: this.props.value
    })
  }

  onKeyDown({keyCode}) {
    switch (keyname(keyCode)) {
      case 'esc':
        this.refs.input.blur()
        break
      case 'enter':
        this.save()
        break
      default:
    }
  }

  onSubmitMouseDown() {
    this.setState({
      preventBlur: true
    })
  }

  onSubmit() {
    this.setState({preventBlur: false}, () => {
      this.save()
      this.refs.input.blur()
    })
  }

  save() {
    this.props.onSave(this.state.value)
  }

  renderSubmitButton() {
    if (!this.state.focused) return null
    return (
      <button
        onMouseDown={::this.onSubmitMouseDown}
        onClick={::this.onSubmit}>
        Done
      </button>
    )
  }

  render() {
    const {multiline, placeholder} = this.props
    const {value} = this.state
    const attrs = {
      placeholder,
      value,
      ref: 'input',
      onChange: ::this.onChange,
      onFocus: ::this.onFocus,
      onBlur: ::this.onBlur,
      onKeyDown: ::this.onKeyDown
    }
    return (
      <div>
        {multiline ? <textarea {...attrs} /> : <input {...attrs} />}
        {this.renderSubmitButton()}
      </div>
    )
  }
}
