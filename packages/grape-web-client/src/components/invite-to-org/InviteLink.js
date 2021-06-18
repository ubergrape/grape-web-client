import PropTypes from 'prop-types'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import random from 'lodash/random'

import Input from '../input/GrayInputNormal'

export default function InviteLink(props) {
  const {
    theme: { classes },
    show,
    placeholder,
    link,
    onClick,
  } = props

  if (!show || !link) return null

  const id = `inviteLink${random(1000000)}`
  return (
    <div className={classes.inviteLink}>
      {/* eslint-disable-next-line jsx-a11y/label-has-for */}
      <label className={classes.inviteLinkLabel} htmlFor={id}>
        <FormattedMessage
          id="inviteLink"
          defaultMessage="Or use this invite-link"
        />
      </label>
      <div className={classes.inviteLinkInput}>
        <Input
          id={id}
          onClick={onClick}
          placeholder={placeholder}
          value={link}
          readonly
        />
      </div>
    </div>
  )
}

InviteLink.propTypes = {
  theme: PropTypes.object.isRequired,
  placeholder: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
}
