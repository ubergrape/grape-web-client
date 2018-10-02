import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'
import MenuList from 'grape-web/lib/components/menu/menuList'
import Divider from 'grape-web/lib/components/divider'
import noop from 'lodash/noop'

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
  LogoutItem,
} from './menuItems'

class Menu extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    onInvite: PropTypes.func,
    onShowIntro: PropTypes.func,
    inviterRole: PropTypes.number,
    supportLink: PropTypes.string.isRequired,
    user: PropTypes.shape({
      role: PropTypes.number.isRequired,
    }),
    permissions: PropTypes.object,
  }

  static defaultProps = {
    onInvite: noop,
    onShowIntro: noop,
    inviterRole: 2,
    user: { role: 2 },
    permissions: undefined,
  }

  render() {
    const {
      classes,
      onInvite,
      onShowIntro,
      supportLink,
      user,
      inviterRole,
      permissions,
    } = this.props
    const items = []
    let key = 0

    if (permissions) {
      const {
        canInviteMembers,
        canViewOrganizationSettings,
        canManageMembers,
        canAddIntegration,
      } = permissions

      if (canInviteMembers) {
        items.push(
          <InviteItem onClick={onInvite} key={key} />,
          <Divider key={++key} />,
        )
      }

      if (canViewOrganizationSettings) {
        items.push(<OrgSettingsItem key={++key} />)
      }

      if (canManageMembers) {
        items.push(<ManageMembersItem key={++key} />)
      }

      if (canAddIntegration) {
        items.push(<AddServiceItem key={++key} />)
      }

      if (
        canViewOrganizationSettings ||
        canManageMembers ||
        canAddIntegration
      ) {
        items.push(<Divider key={++key} />)
      }
    } else {
      const canInvite = user.role >= inviterRole
      const isOrgManager = user.role >= conf.constants.roles.ROLE_ADMIN

      if (canInvite) {
        items.push(
          <InviteItem onClick={onInvite} key={key} />,
          <Divider key={++key} />,
        )
      }

      if (isOrgManager) {
        items.push(
          <OrgSettingsItem key={++key} />,
          <ManageMembersItem key={++key} />,
          <AddServiceItem key={++key} />,
          <Divider key={++key} />,
        )
      }
    }

    items.push(
      <AccountSettingsItem key={++key} />,
      <NotificationSettingsItem key={++key} />,
      <TutorialItem onClick={onShowIntro} key={++key} />,
      <SupportItem href={supportLink} key={++key} />,
    )

    if (permissions) {
      if (permissions.canSwitchOrganization) {
        items.push(<SwitchOrganizationsItem key={++key} />)
      }
    } else {
      items.push(<SwitchOrganizationsItem key={++key} />)
    }

    items.push(<Divider key={++key} />, <LogoutItem key={++key} />)

    return <MenuList className={classes.root}>{items}</MenuList>
  }
}

export default injectSheet({
  root: {
    minWidth: 220,
  },
})(Menu)
