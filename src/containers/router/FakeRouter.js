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

class FakeRouter extends PureComponent {
  static childContextTypes = {
    router: PropTypes.object.isRequired
  }

  getChildContext() {
    return {
      router: {
        history: {
          push: to => this.adressLink(to),
          replace: to => this.adressLink(to),
          createHref: history.createHref
        }
      }
    }
  }

  adressLink = (to) => {
    if (isChatUrl(to)) {
      const match = matchPath(parseUrl(to).pathname, {
        path: channelRoute
      })
      const channelId = Number(match.params.channelId)
      if (channelId === conf.channelId) {
        return this.props.goToMessage(channelId, match.params.messageId)
      }
      return window.open(to)
    }
    return window.open(`${conf.server.serviceUrl}${to}`)
  }

  render() {
    const {children} = this.props
    return children ? React.Children.only(children) : null
  }
}

const actionNames = {
  goToEmbeddedMessage: 'goToMessage'
}

export default connect(null, mapActionsToProps(actionNames))(FakeRouter)
