import React, {PureComponent, PropTypes} from 'react'
import {IntlProvider} from 'react-intl'

import {OrgInfoProvider} from '../containers/org-info'
import {NavigationProvider} from '../containers/navigation'

import {HeaderProvider} from '../containers/header'
import {HistoryProvider} from '../containers/history'

import {SidebarProvider} from '../containers/sidebar'
import {BillingWarningProvider} from '../containers/billing-warning'
import {ChannelMembersInviteProvider} from '../containers/channel-members-invite'
import {NewConversationProvider} from '../containers/new-conversation'
import {InviteToOrgProvider} from '../containers/invite-to-org'
import {NotificationSettingsProvider} from '../containers/notification-settings'
import {ToastNotificationProvider} from '../containers/toast-notification'
import {UnreadChannelsProvider} from '../containers/unread-channels'
import {AlertsProvider} from '../containers/alerts'
import {MarkdownTipsDialogProvider} from '../containers/markdown-tips'
import {FooterProvider} from '../containers/footer'
import {SoundsProvider} from '../containers/sounds'
import {ManageContactsDialogProvider} from '../containers/manage-contacts'
import {FileUploadProvider} from '../containers/file-upload'

import {AppLayout} from '../components/app-layout'

const Aside = ({className}) => (
  <aside className={className}>
    <OrgInfoProvider />
    <NavigationProvider />
  </aside>
)

Aside.propTypes = {
  className: PropTypes.string
}

const Globals = () => (
  <section>
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
  </section>
)

export default class App extends PureComponent {
  static propTypes = {
    locale: PropTypes.string.isRequired,
    messages: PropTypes.array.isRequired
  }

  render() {
    const {
      locale,
      messages
    } = this.props

    return (
      <IntlProvider locale={locale} messages={messages}>
        <FileUploadProvider>
          <AppLayout
            Aside={Aside}
            Header={HeaderProvider}
            Alerts={AlertsProvider}
            History={HistoryProvider}
            Footer={FooterProvider}
            Sidebar={SidebarProvider}
            Globals={Globals} />
        </FileUploadProvider>
      </IntlProvider>
    )
  }
}
