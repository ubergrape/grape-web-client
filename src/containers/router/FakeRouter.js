import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {matchPath} from 'react-router-dom'
import parseUrl from 'grape-web/lib/parse-url'
import {mapActionsToProps} from '../../app/redux'

import history from '../../app/history'
import {channelRoute} from '../../constants/routes'
import conf from '../../conf'
import {isChatUrl} from '../../components/grapedown/utils'

export const onUrlChange = (to, openChannel) => {
  if (!isChatUrl(to)) return window.open(`${conf.server.serviceUrl}${to}`)
  const match = matchPath(parseUrl(to).pathname, {
    path: channelRoute
  })
  const channelId = Number(match.params.channelId)
  if (channelId === conf.channelId) {
    return openChannel(channelId, match.params.messageId)
  }
  return window.open(to)
}

class FakeRouter extends PureComponent {
  static childContextTypes = {
    router: PropTypes.object.isRequired
  }

  getChildContext() {
    const {openChannel} = this.props
    return {
      router: {
        history: {
          push: to => onUrlChange(to, openChannel),
          replace: to => onUrlChange(to, openChannel),
          createHref: history.createHref
        }
      }
    }
  }

  render() {
    const {children} = this.props
    return children ? React.Children.only(children) : null
  }
}

const actionNames = {
  openChannel: 'openChannel'
}

export default connect(null, mapActionsToProps(actionNames))(FakeRouter)
