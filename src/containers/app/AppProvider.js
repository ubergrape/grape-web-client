import React, {PureComponent} from 'react'
import {Provider, connect} from 'react-redux'
import Spinner from 'grape-web/lib/components/spinner'
import theme from 'grape-web/lib/mui-theme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import {ThemeProvider} from 'grape-web/lib/jss'
import {IntlProvider} from 'react-intl'

import {mapActionsToProps} from '../../app/redux'
import {appSelector} from '../../selectors'
import getStore from '../../app/store'
import {Login} from '../../components/login'
import * as translations from '../../i18n'
import conf from '../../conf'

const AppOrLogin = ({show, children, ...rest}) => {
  switch (show) {
    case 'app':
      return children
    case 'login':
      return <Login {...rest} />
    default:
      return <Spinner />
  }
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
        <ThemeProvider theme={theme}>
          <MuiThemeProvider theme={theme}>
            <IntlProvider
              locale={conf.user.languageCode}
              messages={translations[conf.user.languageCode]}
            >
              <AppOrLoginConnected {...this.props} />
            </IntlProvider>
          </MuiThemeProvider>
        </ThemeProvider>
      </Provider>
    )
  }
}
