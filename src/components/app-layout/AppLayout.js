import React, {PureComponent, PropTypes} from 'react'
import injectSheet from 'grape-web/lib/jss'
import {styles} from './theme'

@injectSheet(styles)
export default class AppLayout extends PureComponent {
  static propTypes = {
    sheet: PropTypes.object.isRequired,
    Aside: PropTypes.func.isRequired,
    Header: PropTypes.func.isRequired,
    Alerts: PropTypes.func.isRequired,
    History: PropTypes.func.isRequired,
    Footer: PropTypes.func.isRequired,
    Sidebar: PropTypes.func.isRequired,
    Globals: PropTypes.func.isRequired
  }

  render() {
    const {
      sheet: {classes},
      Aside,
      Header,
      Alerts,
      History,
      Footer,
      Sidebar,
      Globals
    } = this.props

    return (
      <div className={classes.app}>
        <Aside className={classes.aside} />
        <main className={classes.main}>
          <Header />
          <div className={classes.mainBody}>
            <div className={classes.mainLeft}>
              <Alerts />
              <div className={classes.historyWrapper}>
                <History />
              </div>
              <Footer />
            </div>
            <Sidebar className={classes.sidebar} />
          </div>
        </main>
        <Globals />
      </div>
    )
  }
}
