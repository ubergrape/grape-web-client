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
import {UnreadChannelsProvider} from '../../containers/unread-channels'
import {AlertsProvider} from '../../containers/alerts'
import {MarkdownTipsDialogProvider} from '../../containers/markdown-tips'
import {FooterProvider} from '../../containers/footer'

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
        <div className={classes.app}>
          <aside className={classes.aside}>
            <OrgInfoProvider />
            <NavigationProvider />
          </aside>
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
          <BillingWarningProvider />
          <ChannelMembersInviteProvider />
          <NewConversationProvider />
          <InviteToOrgProvider />
          <NotificationSettingsProvider />
          <UnreadChannelsProvider />
          <MarkdownTipsDialogProvider />
        </div>
      </IntlProvider>
    )
  }
}
