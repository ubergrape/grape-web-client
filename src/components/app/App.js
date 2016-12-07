import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'
import {IntlProvider} from 'react-intl'

import {styles} from './theme'

import {OrgInfoProvider} from '../../containers/org-info'
import {NavigationProvider} from '../../containers/navigation'

import {HeaderProvider} from '../../containers/header'
import {HistoryProvider} from '../../containers/history'

import {SidebarProvider} from '../../containers/sidebar'
import {BillingWarningProvider} from '../../containers/billing-warning'
import {ChannelMembersInviteProvider} from '../../containers/channel-members-invite'
import {NewConversationProvider} from '../../containers/new-conversation'
import {InviteToOrgProvider} from '../../containers/invite-to-org'
import {NotificationSettingsProvider} from '../../containers/notification-settings'
import {ToastNotificationProvider} from '../../containers/toast-notification'
import {UnreadChannelsProvider} from '../../containers/unread-channels'
import {AlertsProvider} from '../../containers/alerts'
import {MarkdownTipsDialogProvider} from '../../containers/markdown-tips'
import {FooterProvider} from '../../containers/footer'
import {SoundsProvider} from '../../containers/sounds'
import {ManageContactsDialogProvider} from '../../containers/manage-contacts'
import {FileUploadProvider} from '../../containers/file-upload'

const Aside = ({classes}) => (
  <aside className={classes.aside}>
    <OrgInfoProvider />
    <NavigationProvider />
  </aside>
)

Aside.propTypes = {
  classes: PropTypes.object.isRequired
}

const Main = ({classes}) => (
  <main className={classes.main}>
    <HeaderProvider />
    <div className={classes.mainBody}>
      <div className={classes.mainLeft}>
        <AlertsProvider />
        <div className={classes.historyWrapper}>
          <HistoryProvider />
        </div>
        <FooterProvider />
      </div>
      <SidebarProvider className={classes.sidebar} />
    </div>
  </main>
)

Main.propTypes = {
  classes: PropTypes.object.isRequired
}

@injectSheet(styles)
export default class App extends PureComponent {
  static propTypes = {
    sheet: PropTypes.object.isRequired
  }

  render() {
    const {
      sheet: {classes},
      locale,
      messages
    } = this.props

    return (
      <IntlProvider locale={locale} messages={messages}>
        <FileUploadProvider>
          <div className={classes.app}>
            <Aside classes={classes} />
            <Main classes={classes} />
            <BillingWarningProvider />
            <ChannelMembersInviteProvider />
            <NewConversationProvider />
            <ManageContactsDialogProvider />
            <InviteToOrgProvider />
            <NotificationSettingsProvider />
            <UnreadChannelsProvider />
            <MarkdownTipsDialogProvider />
            <SoundsProvider />
            <ToastNotificationProvider />
          </div>
        </FileUploadProvider>
      </IntlProvider>
    )
  }
}
