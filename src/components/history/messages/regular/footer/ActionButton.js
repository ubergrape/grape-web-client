import React from 'react'
import IconButton from 'material-ui/IconButton'
import ThemeProvider from 'material-ui/styles/MuiThemeProvider'
import {create as createMuiTheme} from 'grape-web/lib/mui-theme'
import {grayLight, white} from 'grape-theme/dist/base-colors'
import color from 'color'

// FIXME ubergrape/grape-web-client#348
export const muiTheme = createMuiTheme({
  overrides: {
    IconButton: {
      iconButton: {
        width: 'auto',
        height: 'auto',
        fontSize: 11,
        border: [1, 'solid', color(grayLight).alpha(0.5).rgbaString()],
        borderRadius: 4,
        padding: [3, 5],
        backgroundColor: white
      }
    }
  }
})

export default props => (
  <ThemeProvider theme={muiTheme}>
    <IconButton {...props} />
  </ThemeProvider>
)
