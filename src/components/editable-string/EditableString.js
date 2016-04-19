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
        inputMode: true,
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
        inputMode: false
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

    if (!this.state.inputMode) {
      this.setState({inputMode: true}, () => {
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
    if (this.state.inputMode) {
      this.setState({
        value: this.props.value,
        inputMode: false
      })
    }
  }

  save() {
    this.setState({saving: true}, () => {
      this.props.onSave(this.state.value)
    })
  }

  renderInput() {
    const {placeholder, sheet} = this.props
    const {value, saving, inputMode} = this.state

    return (
      <input
        className={sheet.classes[inputMode ? 'input' : 'string']}
        ref="input"
        placeholder={placeholder}
        value={value}
        readOnly={!inputMode}
        disabled={saving}
        onChange={::this.onChange}
        onKeyDown={::this.onKeyDown} />
    )
  }

  renderSubmitButton() {
    const {saving, inputMode} = this.state
    return (
      <button
        ref="submit"
        type="submit"
        className={this.props.sheet.classes.submit}
        disabled={saving || !inputMode}>
        Done
      </button>
    )
  }

  render() {
    return (
      <form
        className={this.props.sheet.classes.form}
        onClick={::this.onClick}
        onSubmit={::this.onSubmit}>
        {this.renderInput()}
        {this.renderSubmitButton()}
      </form>
    )
  }
}
