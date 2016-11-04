import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'
import {IntlProvider} from 'react-intl'

import {styles} from './theme'

import {OrgInfoProvider} from '../../containers/org-info'
import {NavigationProvider} from '../../containers/navigation'

import {HeaderProvider} from '../../containers/header'
import {HistoryProvider} from '../../containers/history'
import {Footer} from '../footer'

import {SidebarProvider} from '../../containers/sidebar'

@injectSheet(styles)
export default class Avatar extends PureComponent {
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
                <div className={classes.historyWrapper}>
                  <HistoryProvider />
                </div>
                <Footer />
              </div>
              <SidebarProvider className={classes.sidebar} />
            </div>
          </main>
        </div>
      </IntlProvider>
    )
  }
}
