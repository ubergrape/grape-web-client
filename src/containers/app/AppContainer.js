import React from 'react'
import theme from 'grape-web/lib/mui-theme'
import ThemeProvider from 'material-ui/styles/MuiThemeProvider'

import {IntlProvider} from '../../components/i18n'

export default ({children}) => (
  <ThemeProvider theme={theme}>
    <IntlProvider>
      {children}
    </IntlProvider>
  </ThemeProvider>
)
