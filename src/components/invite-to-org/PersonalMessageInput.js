import React, {PropTypes} from 'react'
import {FormattedMessage} from 'react-intl'
import Input from '../input/GrayInputNormal'

export default function PersonalMessageInput(props) {
  const {
    theme: {classes},
    value,
    disabled,
    placeholder,
    onChange
  } = props

  return (
    <div className={classes.line}>
      <label
        className={classes.label}
        htmlFor="personalMessage">
        <FormattedMessage
          id="personalMessage"
          defaultMessage="Personal message" />
      </label>
      <Input
        type="textarea"
        className={classes.textarea}
        id="personalMessage"
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder} />
    </div>
  )
}

PersonalMessageInput.propTypes = {
  theme: PropTypes.object.isRequired,
  value: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
  placeholder: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}
