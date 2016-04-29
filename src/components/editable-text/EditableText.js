import React, {Component, PropTypes} from 'react'
import {useSheet} from 'grape-web/lib/jss'
import keyname from 'keyname'

import Editable from './Editable'
import listenOutsideClick from '../outside-click/listenOutsideClick'
import style from './style'

const Form = listenOutsideClick(props => {
  return (
    <form {...props}>
      {props.children}
    </form>
  )
})

@useSheet(style)

/**
 * This component renders input or textarea
 * styled as text (transparent background etc..),
 * but once user clicks on it,
 * it becomes styled as textarea or input field.
 */
export default class EditableText extends Component {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    multiline: PropTypes.bool.isRequired,
    onSave: PropTypes.func.isRequired,
    maxLength: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    value: PropTypes.string.isRequired,
    error: PropTypes.string.isRequired,
    placeholder: PropTypes.string.isRequired
  }

  static defaultProps = {
    value: '',
    multiline: false,
    placeholder: '',
    error: ''
  }

  constructor(props) {
    super(props)
    this.state = {
      value: props.value,
      inputMode: false
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.error) {
      this.setState({
        error: true,
        inputMode: true,
        saving: false
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
      return
    }

    this.setState({inputMode: false})
  }

  onClick() {
    if (!this.state.inputMode) this.setState({inputMode: true})
  }

  onChange({target}) {
    this.setState({
      value: target.value,
      error: false
    })
  }

  onKeyDown(e) {
    switch (keyname(e.keyCode)) {
      case 'esc':
        this.restoreState()
        break
      case 'enter':
        e.preventDefault()
        this.setState({ inputMode: false }, () => {
          this.submit()
        })
        break
      default:
    }
  }

  onSubmit(e) {
    e.preventDefault()
    if (!this.state.error) this.save()
  }

  restoreState() {
    if (!this.state.inputMode) return
    this.setState({
      value: this.props.value,
      inputMode: false
    })
  }

  reportCustomValidity() {
    this.submit()
  }

  submit() {
    this.refs.submit.click()
  }

  save() {
    this.setState({saving: true}, () => {
      this.props.onSave(this.state.value)
    })
  }

  renderInput() {
    const {multiline, placeholder, maxLength, sheet} = this.props
    const {value, saving, inputMode} = this.state
    return (
      <Editable
        error={this.state.error ? this.props.error : ''}
        multiline={multiline}
        maxLength={maxLength}
        className={sheet.classes[inputMode ? 'input' : 'string']}
        ref="editable"
        placeholder={placeholder}
        value={value}
        readOnly={!inputMode}
        focused={inputMode}
        disabled={saving}
        onError={::this.reportCustomValidity}
        onChange={::this.onChange}
        onKeyDown={::this.onKeyDown} />
    )
  }

  renderSubmitButton() {
    return (
      <button
        ref="submit"
        type="submit"
        className={this.props.sheet.classes.submit}
        disabled={this.state.saving}>
        Done
      </button>
    )
  }

  render() {
    const {sheet, multiline} = this.props
    const className = `form${multiline ? 'Textarea' : 'Input'}`
    return (
      <Form
        className={sheet.classes[className]}
        onOutsideClick={::this.restoreState}
        onClick={::this.onClick}
        onSubmit={::this.onSubmit}>
        {this.renderInput()}
        {this.renderSubmitButton()}
      </Form>
    )
  }
}
