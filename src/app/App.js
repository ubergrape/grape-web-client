import React, {PureComponent} from 'react'
import injectSheet from 'grape-web/lib/jss'

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
import {IntroProvider} from '../containers/intro'
import {AppProvider} from '../containers/app'
import {AppLayout} from '../components/app-layout'
import {AppContainer} from '../components/app-container'

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
    <IntroProvider />
  </section>
)

@injectSheet({
  '@global': {
    'html, body': {
      margin: 0,
      height: '100vh',
      overflow: 'hidden'
    }
  }
}, {increaseSpecificity: false, isolate: false})
export default class App extends PureComponent {
  render() {
    return (
      <AppProvider>
        <AppContainer>
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
        </AppContainer>
      </AppProvider>
    )
  }
}
