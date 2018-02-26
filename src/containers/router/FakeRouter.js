import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import history from '../../app/history'

class FakeRouter extends PureComponent {
  static childContextTypes = {
    router: PropTypes.object.isRequired
  };

  getChildContext() {
    return {
      router: {
        history: {
          push: history.push,
          replace: history.replace,
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

export default FakeRouter
