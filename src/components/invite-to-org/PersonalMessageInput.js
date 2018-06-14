import PropTypes from 'prop-types'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import random from 'lodash/number/random'

import Input from '../input/GrayInputNormal'

export default function PersonalMessageInput(props) {
  const {
    theme: { classes },
    value,
    disabled,
    placeholder,
    onChange,
  } = props

  const id = `personalMessage${random(1000000)}`
  return (
    <div className={classes.line}>
      <label className={classes.label} htmlFor={id}>
        <FormattedMessage
          id="personalMessage"
          defaultMessage="Personal message"
        />
      </label>
      <Input
        type="textarea"
        className={classes.textarea}
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
      />
    </div>
  )
}

PersonalMessageInput.propTypes = {
  theme: PropTypes.object.isRequired,
  value: PropTypes.string.isRequired,
  disabled: PropTypes.bool.isRequired,
  placeholder: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}
