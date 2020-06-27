import React from 'react'
import PropTypes from 'prop-types'
import { defineMessages, intlShape, injectIntl } from 'react-intl'

const messages = defineMessages({
  inviteMembersNow: {
    id: 'inviteMembersNow',
    defaultMessage: 'Invite members now',
  },
  inviteToOrganization: {
    id: 'inviteToOrganization',
    defaultMessage: 'Invite a new person to your organization',
  },
})

const OrgInviteButton = ({
  intl: { formatMessage },
  id,
  onClick,
  className,
}) => (
  <button className={className} onClick={onClick}>
    {formatMessage(messages[id])}
  </button>
)

OrgInviteButton.propTypes = {
  intl: intlShape.isRequired,
  className: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
}

export default injectIntl(OrgInviteButton)
