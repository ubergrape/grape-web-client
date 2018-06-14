import React from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { ThemeProvider as JssThemeProvider } from '../../jss'

const ThemeProvider = ({ theme, children }) => (
  <JssThemeProvider theme={theme}>
    <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
  </JssThemeProvider>
)

export default ThemeProvider
