import React, {Component, PropTypes} from 'react'
import {findDOMNode} from 'react-dom'
import {useSheet} from 'grape-web/lib/jss'
import keyname from 'keyname'

import ResizableTextarea from '../resizable-textarea/ResizableTextarea'
import listenOutsideClick from '../outside-click/listenOutsideClick'
import style from './style'

const Form = listenOutsideClick(props => {
  return (
    <form {...props}>
      {props.children}
    </form>
  )
})

/**
 * This component renders input or textarea
 * styled as text (transparent background etc..),
 * but once user clicks on it,
 * it becomes styled as textarea or input field.
 */
@useSheet(style)
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
      isEditing: false
    }
  }

  componentDidMount() {
    this.editable = findDOMNode(this.refs.editable)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.error) {
      this.setState({
        error: true,
        isEditing: true,
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
        isEditing: false
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

    this.setState({isEditing: false})
  }

  onClick() {
    if (!this.state.isEditing) {
      this.setState({isEditing: true}, () => {
        const {editable} = this
        editable.focus()
        editable.selectionStart = 0
        editable.selectionEnd = this.state.value.length
      })
    }
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
        this.setState({ isEditing: false }, () => {
          this.refs.submit.click()
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
    if (!this.state.isEditing) return
    this.setState({
      value: this.props.value,
      isEditing: false
    })
  }

  save() {
    this.setState({saving: true}, () => {
      this.props.onSave(this.state.value)
    })
  }

  renderInput() {
    const {multiline, placeholder, maxLength, sheet} = this.props
    const {value, saving, isEditing} = this.state
    const editableProps = {
      multiline,
      maxLength,
      placeholder,
      value,
      className: sheet.classes[isEditing ? 'input' : 'string'],
      ref: 'editable',
      readOnly: !isEditing,
      disabled: saving,
      onChange: ::this.onChange,
      onKeyDown: ::this.onKeyDown
    }

    if (multiline) return <ResizableTextarea {...editableProps} />
    return <input {...editableProps} />
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
