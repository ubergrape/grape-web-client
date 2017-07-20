import React, {PureComponent} from 'react'
import {Provider, connect} from 'react-redux'
import Spinner from 'grape-web/lib/components/spinner'

import {mapActionsToProps} from '../../app/redux'
import {appSelector} from '../../selectors'
import getStore from '../../app/store'
import {Login} from '../../components/login'
import AppContainer from './AppContainer'

const AppOrLogin = ({show, children, ...rest}) => {
  let inner
  if (show === 'app') inner = children
  else if (show === 'login') inner = <Login {...rest} />
  else inner = <Spinner />

  return (
    <AppContainer>
      {inner}
    </AppContainer>
  )
}

const actionNames = {
  checkAuth: 'onCheckAuth',
  loginFromEmbedded: 'onLogin'
}

const AppOrLoginConnected = connect(appSelector, mapActionsToProps(actionNames))(AppOrLogin)

export default class AppProvider extends PureComponent {
  render() {
    return (
      <Provider store={getStore()}>
        <AppOrLoginConnected {...this.props} />
      </Provider>
    )
  }
}
