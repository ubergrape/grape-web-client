import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import injectSheet from 'grape-web/lib/jss'
import { screenWidth } from 'grape-theme/dist/sizes'

import {
  sidebarWidth,
  sidebarWidthXl,
  navigationWidth,
  navigationWidthXl,
} from './constants'

const Noop = () => null

const styles = {
  appLayout: {
    display: 'flex',
    position: 'absolute',
    height: '100%',
    width: '100%',
    // avoid width recalculations in the sidebar that lead to a broken layout with overlaps
    minWidth: navigationWidth + sidebarWidth,
  },
  aside: {
    display: 'flex',
    position: 'relative',
    width: navigationWidthXl,
    flexShrink: 0,
    flexDirection: 'column',
  },
  fileUpload: {
    display: 'flex',
    height: '100%',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },
  mainBody: {
    display: 'flex',
    flex: 1,
    // Flexbox fix, otherwise it stretches full height and you can't scroll
    // anywhere inside in Firefox at least.
    height: '100%',
  },
  mainLeft: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    position: 'relative',
  },
  historyWrapper: {
    position: 'relative',
    flex: 1,
  },
  sidebar: {
    display: 'flex',
    alignItems: 'stretch',
    flexDirection: 'column',
    flexBasis: 'auto',
    width: sidebarWidthXl,
  },
  [`@media (max-width: ${screenWidth.xl}px)`]: {
    aside: {
      width: navigationWidth,
    },
    sidebar: {
      width: sidebarWidth,
    },
  },
}

class AppLayout extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    Aside: PropTypes.func,
    Header: PropTypes.func,
    Alerts: PropTypes.func,
    History: PropTypes.func,
    Footer: PropTypes.func,
    Sidebar: PropTypes.func,
    Globals: PropTypes.func,
    FileUpload: PropTypes.func,
  }

  static defaultProps = {
    Aside: Noop,
    Header: Noop,
    Alerts: Noop,
    History: Noop,
    Footer: Noop,
    Sidebar: Noop,
    Globals: Noop,
    FileUpload: Noop,
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
      FileUpload,
    } = this.props

    return (
      <FileUpload className={classes.fileUpload}>
        <div className={classes.appLayout}>
          <Globals />
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
        </div>
      </FileUpload>
    )
  }
}

export default injectSheet(styles)(AppLayout)
