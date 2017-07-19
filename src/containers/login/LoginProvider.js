import React, {PureComponent} from 'react'
import {Provider, connect} from 'react-redux'

import {mapActionsToProps} from '../../app/redux'
import getStore from '../../app/store'
import {loginSelector as selector} from '../../selectors'
import {Login} from '../../components/login'

const actionNames = {
  checkAuth: 'onCheckAuth'
}

const ConnectedLogin = connect(
  selector,
  mapActionsToProps(actionNames)
)(Login)

export default class LoginProvider extends PureComponent {
  render() {
    return (
      <Provider store={getStore()}>
        <ConnectedLogin />
      </Provider>
    )
  }
}
