import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import injectSheet from 'grape-web/lib/jss'
import MenuList from 'grape-web/lib/components/menu/menuList'
import Divider from 'grape-web/lib/components/divider'
import noop from 'lodash/utility/noop'

import conf from '../../conf'
import {
  InviteItem,
  OrgSettingsItem,
  ManageMembersItem,
  AddServiceItem,
  AccountSettingsItem,
  NotificationSettingsItem,
  TutorialItem,
  SupportItem,
  SwitchOrganizationsItem,
  LogoutItem
} from './menuItems'

@injectSheet({
  root: {
    minWidth: 220
  }
})
export default class Menu extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    onInvite: PropTypes.func.isRequired,
    onShowIntro: PropTypes.func.isRequired,
    inviterRole: PropTypes.number.isRequired,
    user: PropTypes.shape({
      role: PropTypes.number.isRequired
    }).isRequired
  }

  static defaultProps = {
    onInvite: noop,
    onShowIntro: noop,
    inviterRole: 2,
    user: {role: 2}
  }

  render() {
    const {
      classes,
      onInvite,
      onShowIntro,
      user,
      inviterRole
    } = this.props

    const canInvite = user.role >= inviterRole
    const isOrgManager = user.role >= conf.constants.roles.ROLE_ADMIN

    const items = []
    let key = 0

    if (canInvite) {
      items.push(
        <InviteItem onClick={onInvite} key={key} />,
        <Divider key={++key} />
      )
    }

    if (isOrgManager) {
      items.push(
        <OrgSettingsItem key={++key} />,
        <ManageMembersItem key={++key} />,
        <AddServiceItem key={++key} />,
        <Divider key={++key} />
      )
    }

    items.push(
      <AccountSettingsItem key={++key} />,
      <NotificationSettingsItem key={++key} />,
      <TutorialItem onClick={onShowIntro} key={++key} />,
      <SupportItem key={++key} />,
      <SwitchOrganizationsItem key={++key} />,
      <Divider key={++key} />,
      <LogoutItem key={++key} />
    )

    return (
      <MenuList className={classes.root}>
        {items}
      </MenuList>
    )
  }
}
