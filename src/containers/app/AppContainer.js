import React from 'react'
import theme from 'grape-web/lib/mui-theme'
import Normalize from 'grape-web/lib/components/normalize'
import ThemeProvider from 'material-ui/styles/MuiThemeProvider'

import {IntlProvider} from '../../components/i18n'

export default ({children}) => (
  <ThemeProvider theme={theme}>
    <IntlProvider>
      <Normalize style={{height: '100%', position: 'relative'}}>
        {children}
      </Normalize>
    </IntlProvider>
  </ThemeProvider>
)
