import React, {PureComponent} from 'react'

import {HistoryProvider} from '../containers/history'
import {ToastNotificationProvider} from '../containers/toast-notification'
import {BrowserNotificationProvider} from '../containers/browser-notification'
import {AlertsProvider} from '../containers/alerts'
import {MarkdownTipsDialogProvider} from '../containers/markdown-tips'
import {FooterProvider} from '../containers/footer'
import {SoundsProvider} from '../containers/sounds'
import {LinkAttachmentRemoveDialogProvider} from '../containers/link-attachment-remove-dialog'
import {FileUploadProvider} from '../containers/file-upload'
import {AppProvider} from '../containers/app'
import {AppLayout} from '../components/app-layout'

const Globals = () => (
  <section>
    <MarkdownTipsDialogProvider />
    <SoundsProvider />
    <ToastNotificationProvider />
    <LinkAttachmentRemoveDialogProvider />
    <BrowserNotificationProvider />
  </section>
)

export default class EmbeddedApp extends PureComponent {
  render() {
    return (
      <AppProvider>
        <AppLayout
          Alerts={AlertsProvider}
          History={HistoryProvider}
          Footer={FooterProvider}
          FileUpload={FileUploadProvider}
          Globals={Globals}
        />
      </AppProvider>
    )
  }
}
