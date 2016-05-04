import React, {Component, PropTypes} from 'react'
import {useSheet} from 'grape-web/lib/jss'
import keyname from 'keyname'

import listenOutsideClick from '../outside-click/listenOutsideClick'
import Editable from './Editable'
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.error) {
      this.setState({
        error: true,
        isEditing: true,
        saving: false
      }, () => {
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

    this.setState({
      isEditing: false,
      saving: false
    })
  }

  onClick() {
    this.setState({isEditing: true})
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
        this.refs.submit.click()
        break
      default:
    }
  }

  onSubmitClick(e) {
    e.stopPropagation()
  }

  onSubmit(e) {
    e.preventDefault()
    if (!this.state.error) {
      this.setState({isEditing: false}, () => {
        this.save()
      })
    }
  }

  restoreState() {
    const {isEditing, error} = this.state
    if (!isEditing) return
    if (error) {
      this.setState({error: false})
      return
    }

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

  render() {
    const {multiline, placeholder, maxLength, sheet} = this.props
    const {value, saving, isEditing, error} = this.state
    const editableProps = {
      multiline,
      maxLength,
      placeholder,
      value,
      isEditing,
      error: error ? this.props.error : '',
      className: sheet.classes[isEditing ? 'input' : 'string'],
      ref: 'editable',
      readOnly: !isEditing,
      disabled: saving,
      onChange: ::this.onChange,
      onKeyDown: ::this.onKeyDown
    }

    const className = `form${multiline ? 'Textarea' : 'Input'}`
    return (
      <Form
        className={sheet.classes[className]}
        onOutsideClick={::this.restoreState}
        onClick={::this.onClick}
        onSubmit={::this.onSubmit}>
        <Editable {...editableProps} />
        <button
          ref="submit"
          type="submit"
          onClick={::this.onSubmitClick}
          className={sheet.classes.submit}
          disabled={this.state.saving}>
          Done
        </button>
      </Form>
    )
  }
}
