import PropTypes from 'prop-types'
import React, {PureComponent} from 'react'
import createHistory from 'history/createBrowserHistory'

class FakeRouter extends PureComponent {
  static childContextTypes = {
    router: PropTypes.object.isRequired
  };

  getChildContext() {
    const history = createHistory()
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
