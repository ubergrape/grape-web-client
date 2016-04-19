import React, {Component, PropTypes} from 'react'

import keyname from 'keyname'

import style from './style'
import {useSheet} from 'grape-web/lib/jss'

@useSheet(style)
export default class EditableString extends Component {
  static propTypes = {
    sheet: PropTypes.object,
    onSave: PropTypes.func.isRequired,
    value: PropTypes.string,
    error: PropTypes.string,
    placeholder: PropTypes.string
  }

  static defaultProps = {
    value: '',
    placeholder: ''
  }

  constructor(props) {
    super(props)
    this.state = {
      value: props.value
    }

    this.onClickOutside = ::this.restoreState
  }

  componentDidMount() {
    window.addEventListener('click', this.onClickOutside)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.error) {
      this.setState({
        error: true,
        isInputMode: true,
        saving: false
      }, () => {
        const {input, submit} = this.refs
        input.setCustomValidity(this.props.error)
        submit.click()
      })
      return
    }

    if (this.state.saving && nextProps.value === this.props.value) {
      this.setState({
        saving: false,
        isInputMode: false
      })
      return
    }

    if (nextProps.value !== this.props.value) {
      this.setState({
        value: nextProps.value,
        saving: false
      })
    }
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.onClickOutside)
  }

  onClick(e) {
    e.stopPropagation()

    if (!this.state.isInputMode) {
      this.setState({isInputMode: true}, () => {
        const {input} = this.refs
        input.focus()
        input.selectionStart = 0
        input.selectionEnd = this.state.value.length
      })
    }
  }

  onChange({target}) {
    this.refs.input.setCustomValidity('')
    this.setState({
      value: target.value,
      error: false
    })
  }

  onKeyDown({keyCode}) {
    switch (keyname(keyCode)) {
      case 'esc':
        this.restoreState()
        break
      default:
    }
  }

  onSubmit(e) {
    e.preventDefault()
    if (!this.state.error) this.save()
  }

  restoreState() {
    if (this.state.isInputMode) {
      this.setState({
        value: this.props.value,
        isInputMode: false
      })
    }
  }

  save() {
    this.setState({saving: true}, () => {
      this.props.onSave(this.state.value)
    })
  }

  renderInput() {
    const {placeholder} = this.props
    const {value, saving} = this.state

    return (
      <input
        ref="input"
        placeholder={placeholder}
        value={value}
        disabled={saving}
        onChange={::this.onChange}
        onKeyDown={::this.onKeyDown} />
    )
  }

  renderValue() {
    return <span>{this.state.value}</span>
  }

  renderSubmitButton() {
    if (!this.state.isInputMode) return null
    return (
      <button
        ref="submit"
        type="submit"
        disabled={this.state.saving}>
        Done
      </button>
    )
  }

  render() {
    return (
      <form
        onClick={::this.onClick}
        onSubmit={::this.onSubmit}>
        {this.state.isInputMode ? this.renderInput() : this.renderValue()}
        {this.renderSubmitButton()}
      </form>
    )
  }
}
