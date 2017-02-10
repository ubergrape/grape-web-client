import React from 'react'
import theme from 'grape-web/lib/mui-theme'
import ThemeProvider from '@ubergrape/material-ui/styles/MuiThemeProvider'

import {IntlProvider} from '../../components/i18n'
import {FileUploadProvider} from '../file-upload'

export default ({children}) => (
  <IntlProvider>
    <ThemeProvider theme={theme}>
      <FileUploadProvider>
        {children}
      </FileUploadProvider>
    </ThemeProvider>
  </IntlProvider>
)
