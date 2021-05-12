import React from 'react'
import { FormattedMessage } from 'react-intl'

import Item from './MenuItem'

export const InviteItem = props => (
  <Item {...props} icon="invite">
    <FormattedMessage
      id="inviteNewMembers"
      defaultMessage="Invite new members"
      description="Main org dropdown menu"
    />
  </Item>
)

export const OrgSettingsItem = () => (
  <Item icon="cog" href="/accounts/organization/settings">
    <FormattedMessage
      id="orgSettings"
      defaultMessage="Organization Settings"
      description="Main org dropdown menu"
    />
  </Item>
)

export const ManageMembersItem = () => (
  <Item icon="users" href="/accounts/organization/settings/members">
    <FormattedMessage
      id="manageMembers"
      defaultMessage="Manage Members"
      description="Main org dropdown menu"
    />
  </Item>
)

export const AddServiceItem = () => (
  <Item icon="plug" href="/integrations">
    <FormattedMessage
      id="addServiceIntegrations"
      defaultMessage="Add Service Integrations"
      description="Main org dropdown menu"
    />
  </Item>
)

export const AccountSettingsItem = () => (
  <Item icon="idCard" href="/accounts/settings">
    <FormattedMessage
      id="accountSettings"
      defaultMessage="Account Settings"
      description="Main org dropdown menu"
    />
  </Item>
)

export const NotificationSettingsItem = () => (
  <Item icon="bell" href="/accounts/settings/notifications">
    <FormattedMessage
      id="notificationSettings"
      defaultMessage="Notification Settings"
      description="Main org dropdown menu"
    />
  </Item>
)

export const TutorialItem = props => (
  <Item {...props} icon="lifeSaver">
    <FormattedMessage
      id="tutorial"
      defaultMessage="Tutorial"
      description="Main org dropdown menu"
    />
  </Item>
)

export const SupportItem = ({ href }) => (
  <Item icon="help" href={href} target="grape-support">
    <FormattedMessage
      id="supportAndFaq"
      defaultMessage="Support & FAQ"
      description="Main org dropdown menu"
    />
  </Item>
)

export const SwitchOrganizationsItem = () => (
  <Item icon="random" href="/accounts/organization/dashboard">
    <FormattedMessage
      id="switchOrganizations"
      defaultMessage="Switch Organizations"
      description="Main org dropdown menu"
    />
  </Item>
)

export const LogoutItem = () => (
  <Item icon="doorExit" href="/accounts/logout">
    <FormattedMessage
      id="logOut"
      defaultMessage="Log out"
      description="Main org dropdown menu"
    />
  </Item>
)
