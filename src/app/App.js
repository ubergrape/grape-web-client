import React, {PureComponent} from 'react'

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
import {BrowserNotificationProvider} from '../containers/browser-notification'
import {UnreadChannelsProvider} from '../containers/unread-channels'
import {AlertsProvider} from '../containers/alerts'
import {MarkdownTipsDialogProvider} from '../containers/markdown-tips'
import {FooterProvider} from '../containers/footer'
import {SoundsProvider} from '../containers/sounds'
import {ManageContactsDialogProvider} from '../containers/manage-contacts'
import {ManageGroupsDialogProvider} from '../containers/manage-groups'
import {LinkAttachmentRemoveDialogProvider} from '../containers/link-attachment-remove-dialog'
import {RoomDeleteDialogProvider} from '../containers/room-delete'
import {FileUploadProvider} from '../containers/file-upload'
import {AppProvider} from '../containers/app'
import {AppLayout} from '../components/app-layout'

const Aside = ({className}) => (
  <aside className={className}>
    <OrgInfoProvider />
    <NavigationProvider />
  </aside>
)

const Globals = () => (
  <section>
    <BillingWarningProvider />
    <ChannelMembersInviteProvider />
    <NewConversationProvider />
    <ManageContactsDialogProvider />
    <ManageGroupsDialogProvider />
    <InviteToOrgProvider />
    <NotificationSettingsProvider />
    <UnreadChannelsProvider />
    <MarkdownTipsDialogProvider />
    <SoundsProvider />
    <ToastNotificationProvider />
    <LinkAttachmentRemoveDialogProvider />
    <RoomDeleteDialogProvider />
    <BrowserNotificationProvider />
  </section>
)

export default class App extends PureComponent {
  render() {
    return (
      <AppProvider>
        <AppLayout
          Aside={Aside}
          Header={HeaderProvider}
          Alerts={AlertsProvider}
          History={HistoryProvider}
          Footer={FooterProvider}
          Sidebar={SidebarProvider}
          Globals={Globals}
          FileUpload={FileUploadProvider}
        />
      </AppProvider>
    )
  }
}
