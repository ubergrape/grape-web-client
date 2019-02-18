import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import noop from 'lodash/noop'
import keyname from 'keyname'
import injectSheet from 'grape-web/lib/jss'
import listenOutsideClick from 'grape-web/lib/components/outside-click'

import * as themes from './themes'
import { Done } from '../i18n/i18n'
import Editable from './Editable'
import { styles } from './theme'

const Wrapper = listenOutsideClick(({ onClick, className, children }) => (
  // eslint-disable-next-line jsx-a11y/click-events-have-key-events
  <div className={className} onClick={onClick}>
    {children}
  </div>
))

/**
 * This component renders input or textarea
 * styled as text (transparent background etc..),
 * but once user clicks on it,
 * it becomes styled as textarea or input field.
 */
class EditableText extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    multiline: PropTypes.bool,
    onSave: PropTypes.func.isRequired,
    maxLength: PropTypes.number.isRequired,
    value: PropTypes.string,
    error: PropTypes.shape({
      message: PropTypes.string.isRequired,
      level: PropTypes.string.isRequired,
    }),
    clearError: PropTypes.func,
    placeholder: PropTypes.string,
    preserveSpaceForButton: PropTypes.bool,
  }

  static defaultProps = {
    value: '',
    multiline: false,
    placeholder: '',
    error: null,
    clearError: noop,
    preserveSpaceForButton: true,
  }

  constructor(props) {
    super(props)
    this.state = {
      value: props.value,
      isEditing: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.error && !nextProps.error) return
    if (nextProps.error) {
      this.setState({
        saving: false,
        isEditing: true,
      })
      return
    }

    if (this.state.saving && nextProps.value === this.props.value) {
      this.setState({
        saving: false,
        isEditing: false,
      })
      return
    }

    if (nextProps.value !== this.props.value) {
      this.setState({
        value: nextProps.value,
        saving: false,
      })
      return
    }

    this.setState({
      isEditing: false,
      saving: false,
    })
  }

  onClick = () => {
    this.setState({ isEditing: true })
  }

  onChange = ({ target }) => {
    this.setState({ value: target.value })
  }

  onKeyDown = e => {
    switch (keyname(e.keyCode)) {
      case 'esc':
        this.restoreState()
        break
      case 'enter':
        this.save()
        break
      default:
    }
  }

  onClickSave = () => {
    if (this.props.error) return

    this.setState({ isEditing: false }, () => {
      this.save()
    })
  }

  restoreState = () => {
    if (!this.state.isEditing) return
    const { error, clearError, value } = this.props
    if (error) clearError()
    this.setState({
      value,
      isEditing: false,
    })
  }

  save() {
    if (this.props.error) return

    this.setState(
      {
        isEditing: false,
        saving: true,
      },
      () => this.props.onSave(this.state.value),
    )
  }

  render() {
    const {
      multiline,
      placeholder,
      maxLength,
      clearError,
      error,
      classes,
      preserveSpaceForButton,
    } = this.props

    const { value, saving, isEditing } = this.state
    const editableProps = {
      multiline,
      maxLength,
      placeholder,
      value,
      error,
      isEditing,
      themes,
      clearError,
      readOnly: !isEditing,
      disabled: saving,
      onChange: this.onChange,
      onKeyDown: this.onKeyDown,
    }

    const className = `form${multiline ? 'Textarea' : 'Input'}`

    const hiddenButtonClassName = preserveSpaceForButton
      ? 'invisible'
      : 'hidden'

    return (
      <Wrapper
        className={classes[className]}
        onOutsideClick={this.restoreState}
        onClick={this.onClick}
      >
        <Editable {...editableProps} />
        <button
          onClick={this.onClickSave}
          className={`${classes.submit} ${
            classes[isEditing ? '' : hiddenButtonClassName]
          }`}
          disabled={this.state.saving}
        >
          <Done />
        </button>
      </Wrapper>
    )
  }
}

export default injectSheet(styles)(EditableText)
