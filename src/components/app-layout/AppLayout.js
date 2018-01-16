import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import injectSheet from 'grape-web/lib/jss'
import {screenWidth} from 'grape-theme/dist/sizes'

import {sidebarWidth, sidebarWidthXl} from './constants'

const Noop = () => null

@injectSheet({
  appLayout: {
    display: 'flex',
    position: 'absolute',
    height: '100%',
    width: '100%',
    overflow: 'hidden'
  },
  aside: {
    display: 'flex',
    position: 'relative',
    minWidth: 200,
    width: 280,
    flexShrink: 0,
    flexDirection: 'column'
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0
  },
  mainBody: {
    display: 'flex',
    flex: 1,
    // Flexbox fix, otherwise it stretches full height and you can't scroll
    // anywhere inside in Firefox at least.
    height: '100%'
  },
  mainLeft: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    position: 'relative'
  },
  historyWrapper: {
    position: 'relative',
    flex: 1
  },
  sidebar: {
    display: 'flex',
    alignItems: 'stretch',
    flexDirection: 'column',
    flexBasis: 'auto',
    width: sidebarWidthXl
  },
  [`@media (max-width: ${screenWidth.xl}px)`]: {
    aside: {
      width: 230
    },
    sidebar: {
      width: sidebarWidth
    }
  }
})
export default class AppLayout extends PureComponent {
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
    onDidMount: PropTypes.func
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
    onDidMount: Noop
  }

  componentDidMount() {
    this.props.onDidMount()
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
      <FileUpload>
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
