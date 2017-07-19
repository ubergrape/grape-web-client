import React, {PureComponent} from 'react'
import {Provider, connect} from 'react-redux'

import {appSelector} from '../../selectors'
import getStore from '../../app/store'
import {LoginProvider} from '../login'
import AppContainer from './AppContainer'

const AppOrLogin = ({show, children}) => (
  <AppContainer>
    {show ? children : <LoginProvider />}
  </AppContainer>
)

const AppOrLoginConnected = connect(appSelector)(AppOrLogin)

export default class AppProvider extends PureComponent {
  render() {
    return (
      <Provider store={getStore()}>
        <AppOrLoginConnected {...this.props} />
      </Provider>
    )
  }
}
