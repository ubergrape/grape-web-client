import React from 'react'
import theme from 'grape-web/lib/mui-theme'
import ThemeProvider from 'material-ui/styles/MuiThemeProvider'

import {IntlProvider} from '../../components/i18n'
import {renderSheetsInsertionPoints} from '../../app'
import * as translations from '../../i18n'
import conf from '../../conf'

renderSheetsInsertionPoints()

export default ({children}) => (
  <ThemeProvider theme={theme}>
    <IntlProvider
      locale={conf.user.languageCode}
      messages={translations[conf.user.languageCode]}
    >
      {children}
    </IntlProvider>
  </ThemeProvider>
)
