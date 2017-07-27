import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import {FormattedMessage} from 'react-intl'
import injectSheet from 'grape-web/lib/jss'
import Icon from 'grape-web/lib/svg-icons/Icon'
import MenuList from 'material-ui/Menu/MenuList'
import MenuItem from 'material-ui/Menu/MenuItem'
import Divider from 'material-ui/Divider'
import noop from 'lodash/utility/noop'

import conf from '../../conf'
import {styles} from './menuTheme'

const Item = ({classes, icon, children, onClick, href, target}) => {
  const item = (
    <MenuItem className={classes.item} onClick={onClick} dense>
      <Icon name={icon} className={classes.icon} />
      <span className={classes.text}>{children}</span>
    </MenuItem>
  )

  if (href) {
    return (
      <a
        href={href}
        target={target}
        className={classes.anchorItem}
      >
        {item}
      </a>
    )
  }

  return item
}

const InviteItem = ({classes, onClick}) => (
  <Item
    classes={classes}
    icon="invite"
    onClick={onClick}
  >
    <FormattedMessage
      id="inviteNewMembers"
      defaultMessage="Invite new members"
      description="Main org dropdown menu"
    />
  </Item>
)

const OrgSettingsItem = ({classes}) => (
  <Item
    classes={classes}
    icon="cog"
    href="/accounts/organization/settings/"
  >
    <FormattedMessage
      id="orgSettings"
      defaultMessage="Organization Settings"
      description="Main org dropdown menu"
    />
  </Item>
)

const ManageMembersItem = ({classes}) => (
  <Item
    classes={classes}
    icon="user"
    href="/accounts/organization/settings/members/"
  >
    <FormattedMessage
      id="manageMembers"
      defaultMessage="Manage Members"
      description="Main org dropdown menu"
    />
  </Item>
)

const AddServiceItem = ({classes}) => (
  <Item
    classes={classes}
    icon="iconLink"
    href="/integrations/"
  >
    <FormattedMessage
      id="addServiceIntegrations"
      defaultMessage="Add Service Integrations"
      description="Main org dropdown menu"
    />
  </Item>
)

const AccountSettingsItem = ({classes}) => (
  <Item
    classes={classes}
    icon="cog"
    href="/accounts/settings/"
  >
    <FormattedMessage
      id="accountSettings"
      defaultMessage="Account Settings"
      description="Main org dropdown menu"
    />
  </Item>
)

const NotificationSettingsItem = ({classes}) => (
  <Item
    classes={classes}
    icon="bell"
    href="/accounts/settings/notifications/"
  >
    <FormattedMessage
      id="notificationSettings"
      defaultMessage="Notification Settings"
      description="Main org dropdown menu"
    />
  </Item>
)

const TutorialItem = ({classes, onClick}) => (
  <Item
    classes={classes}
    icon="lifeSaver"
    onClick={onClick}
  >
    <FormattedMessage
      id="tutorial"
      defaultMessage="Tutorial"
      description="Main org dropdown menu"
    />
  </Item>
)

const SupportItem = ({classes}) => (
  <Item
    classes={classes}
    icon="help"
    href="http://support.grape.io"
    target="grape-support"
  >
    <FormattedMessage
      id="supportAndFaq"
      defaultMessage="Support & FAQ"
      description="Main org dropdown menu"
    />
  </Item>
)

const SwitchOrganizationsItem = ({classes}) => (
  <Item
    classes={classes}
    icon="random"
    href="/accounts/organization/dashboard/"
  >
    <FormattedMessage
      id="switchOrganizations"
      defaultMessage="Switch Organizations"
      description="Main org dropdown menu"
    />
  </Item>
)

const LogoutItem = ({classes}) => (
  <Item
    classes={classes}
    icon="signOut"
    href="/accounts/logout/"
  >
    <FormattedMessage
      id="logOut"
      defaultMessage="Log out"
      description="Main org dropdown menu"
    />
  </Item>
)

@injectSheet(styles)
export default class Menu extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    onInvite: PropTypes.func.isRequired,
    onshowIntro: PropTypes.func.isRequired,
    inviterRole: PropTypes.number.isRequired,
    user: PropTypes.shape({
      role: PropTypes.number.isRequired
    }).isRequired
  }

  static defaultProps = {
    onInvite: noop,
    onshowIntro: noop,
    inviterRole: 2,
    user: {role: 2}
  }

  render() {
    const {
      classes,
      onInvite,
      onshowIntro,
      user,
      inviterRole
    } = this.props

    const canInvite = user.role >= inviterRole
    const isOrgManager = user.role >= conf.constants.roles.ROLE_ADMIN

    const items = []
    let key = 0

    if (canInvite) {
      items.push(
        <InviteItem classes={classes} onClick={onInvite} key={key} />,
        <Divider key={++key} />
      )
    }

    if (isOrgManager) {
      items.push(
        <OrgSettingsItem classes={classes} key={++key} />,
        <ManageMembersItem classes={classes} key={++key} />,
        <AddServiceItem classes={classes} key={++key} />,
        <Divider key={++key} />
      )
    }

    items.push(
      <AccountSettingsItem classes={classes} key={++key} />,
      <NotificationSettingsItem classes={classes} key={++key} />,
      <TutorialItem classes={classes} onClick={onshowIntro} key={++key} />,
      <SupportItem classes={classes} key={++key} />,
      <SwitchOrganizationsItem classes={classes} key={++key} />,
      <Divider key={++key} />,
      <LogoutItem classes={classes} key={++key} />
    )

    return (
      <MenuList className={classes.menu}>
        {items}
      </MenuList>
    )
  }
}
