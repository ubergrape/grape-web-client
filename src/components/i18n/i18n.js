import PropTypes from 'prop-types'
import React from 'react'
import { FormattedMessage } from 'react-intl'

export function Close() {
  return <FormattedMessage id="close" defaultMessage="Close" />
}

export function CloseLower() {
  return <FormattedMessage id="closeLower" defaultMessage="close" />
}

export function Done() {
  return <FormattedMessage id="done" defaultMessage="Done" />
}

export function ShowMore() {
  return <FormattedMessage id="showMore" defaultMessage="Show more" />
}

export function ShowLess() {
  return <FormattedMessage id="showLess" defaultMessage="Show less" />
}

export const Contacts = props => (
  <FormattedMessage {...props} id="contacts" defaultMessage="Contacts" />
)

export const Groups = props => (
  <FormattedMessage {...props} id="groups" defaultMessage="Groups" />
)

export function Description() {
  return <FormattedMessage id="description" defaultMessage="Description" />
}

export function Create() {
  return <FormattedMessage id="create" defaultMessage="Create" />
}

export function Enter() {
  return <FormattedMessage id="enter" defaultMessage="Enter" />
}

export const InviteSuccess = ({ invited }) => (
  <FormattedMessage
    id="justInvited"
    defaultMessage={`Congratulations! You just invited {user} {amount, plural,
        =0 {}
        one {and one more people}
        other {and {amount} more people}}.`}
    values={{
      user: invited[0],
      amount: invited.length - 1,
    }}
  />
)

InviteSuccess.propTypes = {
  invited: PropTypes.arrayOf(PropTypes.string),
}

export const SharedFiles = () => (
  <FormattedMessage id="sharedFiles" defaultMessage="Shared Files" />
)

export const PinnedMessages = () => (
  <FormattedMessage id="pinnedMesages" defaultMessage="Pinned Messages" />
)

export const GroupInfo = () => (
  <FormattedMessage id="groupInfo" defaultMessage="Group Info" />
)

export const UserProfile = () => (
  <FormattedMessage id="userProfile" defaultMessage="User Profile" />
)

export const Loading = () => (
  <FormattedMessage id="loading" defaultMessage="Loading..." />
)

export const Communication = () => (
  <FormattedMessage
    id="communication"
    defaultMessage="Communicating with Grape universe, this may take a moment"
  />
)
