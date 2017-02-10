import React from 'react'
import IconButton from '@ubergrape/material-ui/IconButton/IconButton'
import ThemeProvider from '@ubergrape/material-ui/styles/MuiThemeProvider'
import {create as createMuiTheme} from 'grape-web/lib/mui-theme'
import {grayLight} from 'grape-theme/dist/base-colors'
import color from 'color'

export const muiTheme = createMuiTheme({
  overrides: {
    IconButton: {
      iconButton: {
        width: 'auto',
        height: 'auto',
        fontSize: 11,
        border: [1, 'solid', color(grayLight).alpha(0.5).rgbaString()],
        borderRadius: 4,
        padding: [3, 5]
      }
    }
  }
})

export default props => (
  <ThemeProvider theme={muiTheme}>
    <IconButton {...props} />
  </ThemeProvider>
)
