import React from 'react'
import injectSheet from 'grape-web/lib/jss'

import { Router } from '../containers/router'
import { OrgInfoProvider } from '../containers/org-info'
import { NavigationProvider } from '../containers/navigation'
import { HeaderProvider } from '../containers/header'
import { HistoryProvider } from '../containers/history'
import { SidebarProvider } from '../containers/sidebar'
import { BillingWarningProvider } from '../containers/billing-warning'
import { ChannelMembersInviteProvider } from '../containers/channel-members-invite'
import { NewConversationProvider } from '../containers/new-conversation'
import { InviteToOrgProvider } from '../containers/invite-to-org'
import { NotificationSettingsProvider } from '../containers/notification-settings'
import { ToastNotificationProvider } from '../containers/toast-notification'
import { BrowserNotificationProvider } from '../containers/browser-notification'
import { UnreadChannelsProvider } from '../containers/unread-channels'
import { AlertsProvider } from '../containers/alerts'
import { MarkdownTipsDialogProvider } from '../containers/markdown-tips'
import { FooterProvider } from '../containers/footer'
import { SoundsProvider } from '../containers/sounds'
import { LinkAttachmentRemoveDialogProvider } from '../containers/link-attachment-remove-dialog'
import { RoomDeleteDialogProvider } from '../containers/room-delete'
import { FileUploadProvider } from '../containers/file-upload'
import { IntroProvider } from '../containers/intro'
import { VideoConferenceWarningDialogProvider } from '../containers/video-conference-warning-dialog'
import { IncomingCallProvider } from '../containers/incoming-call'
import { CallStatusProvider } from '../containers/call-status'
import { AppProvider } from '../containers/app'
import { AppLayout } from '../components/old/app-layout'

const Aside = ({ className }) => (
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
    <InviteToOrgProvider />
    <NotificationSettingsProvider />
    <UnreadChannelsProvider />
    <MarkdownTipsDialogProvider />
    <SoundsProvider />
    <ToastNotificationProvider />
    <LinkAttachmentRemoveDialogProvider />
    <RoomDeleteDialogProvider />
    <BrowserNotificationProvider />
    <VideoConferenceWarningDialogProvider />
    <IncomingCallProvider />
    <CallStatusProvider />
    <IntroProvider />
  </section>
)

export default injectSheet(
  {
    '@global': {
      'html, body': {
        margin: 0,
        height: '100vh',
        overflow: 'hidden',
      },
    },
  },
  { increaseSpecificity: false, isolate: false },
)(() => (
  <AppProvider>
    {props => (
      <Router {...props}>
        <AppLayout
          Aside={Aside}
          Header={HeaderProvider}
          Alerts={AlertsProvider}
          History={HistoryProvider}
          Sidebar={SidebarProvider}
          Globals={Globals}
          FileUpload={FileUploadProvider}
          Footer={FooterProvider}
        />
      </Router>
    )}
  </AppProvider>
))
