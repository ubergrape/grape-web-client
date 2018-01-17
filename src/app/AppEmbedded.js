import React, {PureComponent} from 'react'

import {Router} from '../containers/router'
import {HistoryProvider} from '../containers/history'
import {ToastNotificationProvider} from '../containers/toast-notification'
import {BrowserNotificationProvider} from '../containers/browser-notification'
import {AlertsProvider} from '../containers/alerts'
import {MarkdownTipsDialogProvider} from '../containers/markdown-tips'
import {FooterProvider} from '../containers/footer'
import {SoundsProvider} from '../containers/sounds'
import {LinkAttachmentRemoveDialogProvider} from '../containers/link-attachment-remove-dialog'
import {FileUploadProvider} from '../containers/file-upload'
import {SidebarProvider} from '../containers/sidebar'
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

export default class AppEmbedded extends PureComponent {
  render() {
    return (
      <AppProvider>
        {props =>
          <Router {...props}>
            <AppLayout
              Alerts={AlertsProvider}
              History={HistoryProvider}
              Footer={FooterProvider}
              FileUpload={FileUploadProvider}
              Sidebar={SidebarProvider}
              Globals={Globals}
            />
          </Router>
        }
      </AppProvider>
    )
  }
}
