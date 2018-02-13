import React, {PureComponent} from 'react'
import {Provider as ReduxProvider, connect} from 'react-redux'
import Spinner from 'grape-web/lib/components/spinner'
import theme from 'grape-web/lib/mui-theme'
import StyleProvider from 'grape-web/lib/theme-provider'
import {JssProvider, jss} from 'grape-web/lib/jss'
import {IntlProvider} from 'react-intl'

import {mapActionsToProps} from '../../app/redux'
import {appSelector} from '../../selectors'
import getStore from '../../app/store'
import {Login} from '../../components/login'
import * as translations from '../../i18n'
import conf from '../../conf'

const AppOrLogin = ({show, children, onChangeRoute, ...rest}) => {
  switch (show) {
    case 'app':
      return children({onChangeRoute})
    case 'login':
      return <Login {...rest} />
    default:
      return <Spinner />
  }
}

const actionNames = {
  checkAuth: 'onCheckAuth',
  loginFromEmbedded: 'onLogin',
  handleChangeRoute: 'onChangeRoute'
}

const AppOrLoginConnected = connect(appSelector, mapActionsToProps(actionNames))(AppOrLogin)

export default class AppProvider extends PureComponent {
  render() {
    return (
      <ReduxProvider store={getStore()}>
        <JssProvider jss={jss}>
          <StyleProvider theme={theme}>
            <IntlProvider
              locale={conf.user.languageCode}
              messages={translations[conf.user.languageCode]}
            >
              <AppOrLoginConnected {...this.props} />
            </IntlProvider>
          </StyleProvider>
        </JssProvider>
      </ReduxProvider>
    )
  }
}
