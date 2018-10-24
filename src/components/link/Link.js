import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { Link as RouterLink } from 'grape-web/lib/router'
import parseUrl from 'grape-web/lib/parse-url'

import isChatUrl from '../../utils/is-chat-url'

export default class Link extends PureComponent {
  static propTypes = {
    href: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
  }

  render() {
    const { href, children } = this.props

    // If a link is external, or link without HTTP/https protocol app should
    // render the default link with target="_blank". More details here:
    // https://github.com/ReactTraining/react-router/issues/1147,
    // https://github.com/ReactTraining/react-router/issues/1147#issuecomment-113180174
    if (!isChatUrl(href) && /^https?:\/\//.test(href)) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      )
    }

    return (
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      <RouterLink to={parseUrl(href).pathname || href}>{children}</RouterLink>
    )
  }
}
