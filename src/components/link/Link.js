import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Link as RouterLink } from 'grape-web/lib/router'
import parseUrl from 'grape-web/lib/parse-url'
import injectSheet from 'grape-web/lib/jss'
import { isElectron } from 'grape-web/lib/x-platform/electron'

import isChatUrl from '../../utils/is-chat-url'
import styles from './theme'

class Link extends PureComponent {
  static propTypes = {
    href: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    classes: PropTypes.object.isRequired,
  }

  onClick = () => {
    window.require('electron').shell.openExternal(this.props.href)
  }

  render() {
    const { href, children, classes } = this.props

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

    return (
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      <RouterLink to={parseUrl(href).pathname}>{children}</RouterLink>
    )
  }
}

export default injectSheet(styles)(Link)
