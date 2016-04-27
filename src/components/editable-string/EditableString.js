import React, {Component, PropTypes} from 'react'
import {findDOMNode} from 'react-dom'
import {useSheet} from 'grape-web/lib/jss'
import capitalize from 'lodash/string/capitalize'
import keyname from 'keyname'

import Editable from './Editable'
import style from './style'

@useSheet(style)
export default class EditableString extends Component {
  static propTypes = {
    sheet: PropTypes.object,
    type: PropTypes.string,
    onSave: PropTypes.func.isRequired,
    maxLength: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    value: PropTypes.string,
    error: PropTypes.string,
    placeholder: PropTypes.string
  }

  static defaultProps = {
    value: '',
    type: 'input',
    placeholder: ''
  }

  constructor(props) {
    super(props)
    this.state = {
      value: props.value
    }

    this.onClickOutside = ::this.onClickOutside
    this.preventClickOutside = false
  }

  componentDidMount() {
    this.editable = findDOMNode(this.refs.editable)
    window.addEventListener('click', this.onClickOutside)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.error) {
      this.setState({
        error: true,
        inputMode: true,
        saving: false
      }, () => {
        this.editable.setCustomValidity(this.props.error)
        this.refs.submit.click()
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

  componentWillUnmount() {
    window.removeEventListener('click', this.onClickOutside)
  }

  onClick() {
    this.preventClickOutside = true

    if (!this.state.inputMode) {
      this.setState({inputMode: true}, () => {
        const {editable} = this
        editable.focus()
        editable.selectionStart = 0
        editable.selectionEnd = this.state.value.length
      })
    }
  }

  onClickOutside() {
    if (!this.preventClickOutside) this.restoreState()
    this.preventClickOutside = false
  }

  onChange({target}) {
    this.editable.setCustomValidity('')
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
        this.refs.submit.click()
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
    const {type, placeholder, maxLength, sheet} = this.props
    const {value, saving, inputMode} = this.state
    return (
      <Editable
        type={type}
        maxLength={maxLength}
        className={sheet.classes[inputMode ? 'input' : 'string']}
        ref="editable"
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
    const {sheet, type} = this.props
    const className = `form${capitalize(type)}`
    return (
      <form
        ref="form"
        className={sheet.classes[className]}
        onClick={::this.onClick}
        onSubmit={::this.onSubmit}>
        {this.renderInput()}
        {this.renderSubmitButton()}
      </form>
    )
  }
}
