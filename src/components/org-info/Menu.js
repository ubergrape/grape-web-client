import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'
import MenuList from 'grape-web/lib/components/menu/menuList'
import Divider from 'grape-web/lib/components/divider'
import noop from 'lodash/noop'

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
    supportLink: PropTypes.string.isRequired,
    permissions: PropTypes.object,
  }

  static defaultProps = {
    onInvite: noop,
    onShowIntro: noop,
    permissions: {},
  }

  render() {
    const {
      classes,
      onInvite,
      onShowIntro,
      supportLink,
      permissions,
    } = this.props
    const items = []
    let key = 0

    const {
      canInviteMembers,
      canViewOrganizationSettings,
      canManageMembers,
      canAddIntegration,
      canEditProfile,
      canSeeTutorial,
      canSwitchOrganization,
      canLogout,
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

    if (canViewOrganizationSettings || canManageMembers || canAddIntegration) {
      items.push(<Divider key={++key} />)
    }

    if (canEditProfile) {
      items.push(<AccountSettingsItem key={++key} />)
    }

    items.push(<NotificationSettingsItem key={++key} />)

    if (canSeeTutorial) {
      items.push(<TutorialItem onClick={onShowIntro} key={++key} />)
    }

    items.push(<SupportItem href={supportLink} key={++key} />)

    if (canSwitchOrganization) {
      items.push(<SwitchOrganizationsItem key={++key} />)
    }

    if (canLogout) {
      items.push(<Divider key={++key} />, <LogoutItem key={++key} />)
    }

    return <MenuList className={classes.root}>{items}</MenuList>
  }
}

export default injectSheet({
  root: {
    minWidth: 220,
  },
})(Menu)
