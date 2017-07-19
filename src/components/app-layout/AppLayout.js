import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import injectSheet from 'grape-web/lib/jss'

import {styles} from './theme'

const Noop = () => null

@injectSheet(styles)
export default class AppLayout extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    Aside: PropTypes.func.isRequired,
    Header: PropTypes.func.isRequired,
    Alerts: PropTypes.func.isRequired,
    History: PropTypes.func.isRequired,
    Footer: PropTypes.func.isRequired,
    Sidebar: PropTypes.func.isRequired,
    Globals: PropTypes.func.isRequired,
    FileUpload: PropTypes.func.isRequired
  }

  static defaultProps = {
    Aside: Noop,
    Header: Noop,
    Alerts: Noop,
    History: Noop,
    Footer: Noop,
    Sidebar: Noop,
    Globals: Noop,
    FileUpload: Noop
  }

  render() {
    const {
      classes,
      Aside,
      Header,
      Alerts,
      History,
      Footer,
      Sidebar,
      Globals,
      FileUpload
    } = this.props

    return (
      <div className={classes.app}>
        <Globals />
        <FileUpload>
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
        </FileUpload>
      </div>
    )
  }
}
