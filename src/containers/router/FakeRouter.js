import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {mapActionsToProps} from '../../app/redux'

import history from '../../app/history'

class FakeRouter extends PureComponent {
  static childContextTypes = {
    router: PropTypes.object.isRequired
  }

  getChildContext() {
    return {
      router: {
        history: {
          push: this.onUrlChange,
          replace: this.onUrlChange,
          createHref: history.createHref
        }
      }
    }
  }

  onUrlChange = to => this.props.onUrlChange(to)

  render() {
    const {children} = this.props
    return children ? React.Children.only(children) : null
  }
}

const actionNames = {
  onEmbeddedUrlChange: 'onUrlChange'
}

export default connect(null, mapActionsToProps(actionNames))(FakeRouter)
