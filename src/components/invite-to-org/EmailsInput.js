import React, {PropTypes} from 'react'
import {FormattedMessage} from 'react-intl'
import random from 'lodash/number/random'

import Input from '../input/GrayInputNormal'

export default function EmailsInput(props) {
  const {
    theme: {classes},
    value, disabled, placeholder,
    onChange, error, clearError
  } = props

  let noteClassNames = classes.note
  if (value) noteClassNames += ` ${classes.noteVisible}`

  const id = `emailAddresses${random(1000000)}`
  return (
    <div className={classes.line}>
      <label
        className={classes.label}
        htmlFor={id}>
        <FormattedMessage
          id={id}
          defaultMessage="Email addresses" />
      </label>
      <Input
        type="textarea"
        value={value}
        error={error}
        onChange={onChange}
        clearError={clearError}
        className={classes.textarea}
        id="emailAddresses"
        disabled={disabled}
        placeholder={placeholder} />
      <div className={noteClassNames}>
        {placeholder}
      </div>
    </div>
  )
}

EmailsInput.propTypes = {
  theme: PropTypes.object.isRequired,
  value: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
  placeholder: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  clearError: PropTypes.func.isRequired,
  error: PropTypes.object
}
