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
          push: to => this.identifyLink(to),
          replace: to => this.identifyLink(to),
          createHref: history.createHref
        }
      }
    }
  }

  identifyLink = (to) => {
    if (isChatUrl(to)) {
      const match = matchPath(parseUrl(to).pathname, {
        path: channelRoute
      })
      if (Number(match.params.channelId) === conf.channelId) {
        this.props.goTo(Number(match.params.channelId), match.params.messageId)
      } else {
        window.open(to)
      }
    } else {
      window.open(`${conf.server.serviceUrl}${to}`)
    }
  }

  render() {
    const {children} = this.props
    return children ? React.Children.only(children) : null
  }
}

const actionNames = {
  goToMessageEmbedded: 'goTo'
}

export default connect(null, mapActionsToProps(actionNames))(FakeRouter)
