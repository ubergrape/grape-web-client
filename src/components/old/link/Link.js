import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Link as RouterLink } from 'grape-web/lib/router'
import parseUrl from 'grape-web/lib/parse-url'
import injectSheet from 'grape-web/lib/jss'
import { isElectron } from 'grape-web/lib/x-platform/electron'

import isChatUrl from '../../../utils/is-chat-url'
import isCallUrl from '../../../utils/is-call-url'
import styles from './theme'

class Link extends PureComponent {
  static propTypes = {
    href: PropTypes.string.isRequired,
    tag: PropTypes.string,
    children: PropTypes.node.isRequired,
    classes: PropTypes.object.isRequired,
  }

  static defaultProps = {
    tag: '',
  }

  onClick = () => {
    // Those checks should be removed within some time. Only window.grapeAppBridge usage should be saved
    if (window.grapeAppBridge) {
      window.grapeAppBridge.openExternal(this.props.href)
      return
    }

    if (window.GrapeAppBridge) {
      window.GrapeAppBridge.openExternal(this.props.href)
      return
    }

    window.require('electron').shell.openExternal(this.props.href)
  }

  render() {
    const { href, children, tag, classes } = this.props

    // In Electron calls should be opened in a second window.
    // In a Browser it should be opened as a new tab.
    if (isCallUrl(href)) {
      const tagsToOpenAsExternal = ['calling', 'inCall']
      if (isElectron && !tagsToOpenAsExternal.includes(tag)) {
        return (
          <button className={classes.externalLink} onClick={this.onClick}>
            {children}
          </button>
        )
      }

      return (
        <a
          href={href}
          className={classes.externalLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      )
    }

    // If a link is external, or link without HTTP/https protocol app should
    // render the default link with target="_blank". More details here:
    // https://github.com/ReactTraining/react-router/issues/1147,
    // https://github.com/ReactTraining/react-router/issues/1147#issuecomment-113180174
    if (!isChatUrl(href)) {
      // If currect platform is Electron, we should render button to prevent remote
      // code execution
      if (isElectron) {
        return (
          <button className={classes.externalLink} onClick={this.onClick}>
            {children}
          </button>
        )
      }

      return (
        <a
          href={href}
          className={classes.externalLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      )
    }

    return <RouterLink to={parseUrl(href).pathname}>{children}</RouterLink>
  }
}

export default injectSheet(styles)(Link)
