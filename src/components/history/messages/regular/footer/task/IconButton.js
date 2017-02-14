import React from 'react'
import ThemeProvider from 'material-ui/styles/MuiThemeProvider'
import {create as createMuiTheme} from 'grape-web/lib/mui-theme'
import Icon from 'grape-web/lib/svg-icons/Icon'
import IconButton from 'material-ui/IconButton'

// FIXME ubergrape/grape-web-client#348
export const muiTheme = createMuiTheme({
  overrides: {
    IconButton: {
      iconButton: {
        cursor: 'pointer',
        width: 'auto',
        height: 'auto'
      }
    }
  }
})

export default ({classes, icon, onClick, className}) => (
  <ThemeProvider theme={muiTheme}>
    <IconButton className={className} onClick={onClick}>
      <Icon name={icon} className={classes.iconButtonIcon} />
    </IconButton>
  </ThemeProvider>
)
