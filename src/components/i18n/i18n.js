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

export const InviteSuccess = ({ invited }) => {
  const user = invited[0]
  const amount = invited.length - 1

  return (
    <FormattedMessage
      id="justInvited"
      defaultMessage={`{justInvitedCongratulations} {amount, plural,
        =0 {}
        one {{amountOnePlural}}
        other {{amountOtherPlural}}
      }.`}
      values={{
        user,
        amount,
        justInvitedCongratulations: (
          <FormattedMessage
            id="justInvitedCongratulations"
            defaultMessage="Congratulations! You just invited {user}"
          />
        ),
        justInvitedAmountOnePlural: (
          <FormattedMessage
            id="justInvitedAmountOnePlural"
            defaultMessage="and one more member"
          />
        ),
        justInvitedAmountOtherPlural: (
          <FormattedMessage
            id="justInvitedAmountOtherPlural"
            defaultMessage="and {amount} more members"
          />
        ),
      }}
    />
  )
}

InviteSuccess.propTypes = {
  invited: PropTypes.arrayOf(PropTypes.string).isRequired,
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
  <FormattedMessage id="loading" defaultMessage="Loading…" />
)

export const Communication = () => (
  <FormattedMessage
    id="communication"
    defaultMessage="Communicating with {product} universe, this may take a moment"
    values={{ product: __PRODUCT_NAME__ }}
  />
)

export const WantToChat = () => (
  <FormattedMessage id="wantToChat" defaultMessage="Want to chat?" />
)

export const NoChannelsToChatIn = () => (
  <FormattedMessage
    id="noChannelsToChatIn"
    defaultMessage="You have no people or groups to chat with at the moment. Join a group or start a new conversation to have more fun."
  />
)

export const JoinGroup = () => (
  <FormattedMessage id="joinGroup" defaultMessage="Join a group" />
)

export const StartNewConversation = () => (
  <FormattedMessage
    id="startNewConversation"
    defaultMessage="Start a new conversation"
  />
)
