import React, {PureComponent, PropTypes} from 'react'
import {FormattedMessage} from 'react-intl'
import injectSheet from 'grape-web/lib/jss'
import Icon from 'grape-web/lib/svg-icons/Icon'
import MenuList from '@ubergrape/material-ui/Menu/MenuList'
import MenuItem from '@ubergrape/material-ui/Menu/MenuItem'
import Divider from '@ubergrape/material-ui/Divider'

import {styles} from './menuTheme'

const Item = ({classes, icon, children, onClick, href, target}) => {
  const item = (
    <MenuItem className={classes.item} onClick={onClick}>
      <Icon name={icon} className={classes.icon} />
      <span className={classes.text}>{children}</span>
    </MenuItem>
  )

  return href ? <a href={href} target={target}>{item}</a> : item
}

@injectSheet(styles)
export default class Menu extends PureComponent {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    onInvite: PropTypes.func.isRequired,
    onShowTutorial: PropTypes.func.isRequired
  }

  render() {
    const {
      sheet: {classes},
      onInvite,
      onShowTutorial
    } = this.props

    return (
      <MenuList className={classes.menu}>
        <Item
          classes={classes}
          icon="invite"
          onClick={onInvite}
        >
          <FormattedMessage
            id="inviteNewMembers"
            defaultMessage="Invite new members"
            description="Main org dropdown menu"
          />
        </Item>
        <Divider />
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
        <Divider />
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
        <Item
          classes={classes}
          icon="lifeSaver"
          onClick={onShowTutorial}
        >
          <FormattedMessage
            id="tutorial"
            defaultMessage="Tutorial"
            description="Main org dropdown menu"
          />
        </Item>
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
        <Divider />
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
      </MenuList>
    )
  }
}
