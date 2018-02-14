import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import {ThemeProvider as JssThemeProvider} from 'react-jss'

const StyleProvider = ({theme, children}) => (
  <JssThemeProvider theme={theme}>
    <MuiThemeProvider theme={theme}>
      {children}
    </MuiThemeProvider>
  </JssThemeProvider>
)

export default StyleProvider
