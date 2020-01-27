import PropTypes from 'prop-types'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { random, noop } from 'lodash'

import Input from '../input/GrayInputNormal'

export default function EmailsInput(props) {
  const {
    theme: { classes },
    value,
    disabled,
    focused = false,
    placeholder,
    onChange,
    error,
    clearError,
  } = props

  let noteClassNames = classes.note
  if (value) noteClassNames += ` ${classes.noteVisible}`

  const id = `emailAddresses${random(1000000)}`
  return (
    <div className={classes.line}>
      {/* eslint-disable-next-line jsx-a11y/label-has-for */}
      <label className={classes.label} htmlFor={id}>
        <FormattedMessage
          id="emailAddresses"
          defaultMessage="Email addresses"
        />
      </label>
      <Input
        type="textarea"
        focused={focused}
        value={value}
        error={error}
        onChange={onChange}
        clearError={clearError}
        className={classes.textarea}
        id={id}
        disabled={disabled}
        placeholder={placeholder}
      />
      <div className={noteClassNames}>{placeholder}</div>
    </div>
  )
}

EmailsInput.defaultProps = {
  error: {},
  focused: false,
  clearError: noop,
}

EmailsInput.propTypes = {
  theme: PropTypes.object.isRequired,
  value: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
  focused: PropTypes.bool,
  placeholder: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  clearError: PropTypes.func,
  error: PropTypes.object,
}
