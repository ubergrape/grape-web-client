import React, {Component, PropTypes} from 'react'
import {useSheet} from 'grape-web/lib/jss'
import keyname from 'keyname'
import noop from 'lodash/utility/noop'

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
    onChange: PropTypes.func.isRequired,
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
    error: '',
    onKeyDown: noop,
    onChange: noop
  }

  constructor(props) {
    super(props)
    this.state = {
      value: props.value,
      isEditing: false
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps)
    if (nextProps.error) {
      this.setState({
        error: true,
        isEditing: true,
        saving: false
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

    if (nextProps.value !== this.state.value) {
      this.setState({
        value: nextProps.value,
        saving: false
      })
      return
    }
    console.log(nextProps, this.props, this.state)
    this.setState({
      isEditing: false,
      saving: false
    })
  }

  onEnableEditable() {
    if (!this.state.isEditing) this.setState({isEditing: true, saving: false})
  }

  onChange(e) {
    this.setState({
      value: e.target.value,
      saving: false,
      error: false
    }, () => {
      this.props.onChange(e)
    })
  }

  onKeyDown(e) {
    switch (keyname(e.keyCode)) {
      case 'esc':
        this.restoreState()
        break
      case 'enter':
        e.preventDefault()
        this.setState({isEditing: false}, () => {
          this.submit()
        })
        break
      default:
    }
  }

  onSubmit(e) {
    e.preventDefault()
    if (!this.state.error) {
      this.save()
    }
  }

  restoreState() {
    if (!this.state.isEditing) return
    this.setState({
      value: this.props.value,
      error: false,
      saving: false,
      isEditing: false
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

  render() {
    const {multiline, placeholder, maxLength, sheet} = this.props
    const {value, saving, isEditing} = this.state
    const className = `form${multiline ? 'Textarea' : 'Input'}`
    return (
      <Form
        className={sheet.classes[className]}
        onOutsideClick={::this.restoreState}
        onClick={::this.onEnableEditable}
        onSubmit={::this.onSubmit}>
        <Editable
          error={this.state.error ? this.props.error : ''}
          multiline={multiline}
          maxLength={maxLength}
          className={sheet.classes[isEditing ? 'input' : 'string']}
          placeholder={placeholder}
          value={value}
          readOnly={!isEditing}
          focus={isEditing}
          disabled={saving}
          onError={::this.reportCustomValidity}
          onChange={::this.onChange}
          onKeyDown={::this.onKeyDown} />
        <button
          ref="submit"
          type="submit"
          className={sheet.classes.submit}
          disabled={saving}>
          Done
        </button>
      </Form>
    )
  }
}
