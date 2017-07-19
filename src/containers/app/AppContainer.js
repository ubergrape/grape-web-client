import React from 'react'
import theme from 'grape-web/lib/mui-theme'
import ThemeProvider from 'material-ui/styles/MuiThemeProvider'

import {IntlProvider} from '../../components/i18n'

export default ({children}) => (
  <IntlProvider>
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  </IntlProvider>
)
