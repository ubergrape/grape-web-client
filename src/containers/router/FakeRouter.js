import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { mapActionsToProps } from '../../app/redux'

import history from '../../app/history'

class FakeRouter extends PureComponent {
  static childContextTypes = {
    router: PropTypes.object.isRequired,
  }

  getChildContext() {
    return {
      router: {
        history: {
          push: this.props.onChangeRoute,
          replace: this.props.onChangeRoute,
          createHref: history.createHref,
        },
      },
    }
  }

  render() {
    const { children } = this.props
    return children ? React.Children.only(children) : null
  }
}

const actionNames = {
  goTo: 'onChangeRoute',
}

export default connect(
  null,
  mapActionsToProps(actionNames),
)(FakeRouter)
