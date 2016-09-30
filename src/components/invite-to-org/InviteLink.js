import React, {PropTypes} from 'react'
import {FormattedMessage} from 'react-intl'
import random from 'lodash/number/random'

import Input from '../input/GrayInputNormal'

export default function InviteLink(props) {
  const {
    theme: {classes},
    show, placeholder, link,
    onClick
  } = props

  if (!show || !link) return null

  const id = `inviteLink${random(1000000)}`
  return (
    <div className={classes.inviteLink}>
      <label
        className={classes.label}
        htmlFor={id}>
        <FormattedMessage
          id={id}
          defaultMessage="Or use this invite-link" />
      </label>
      <Input
        id="inviteLink"
        onClick={onClick}
        placeholder={placeholder}
        value={link}
        readonly />
    </div>
  )
}

InviteLink.propTypes = {
  theme: PropTypes.object.isRequired,
  placeholder: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
}

InviteLink.defaultProps = {
  link: ''
}
