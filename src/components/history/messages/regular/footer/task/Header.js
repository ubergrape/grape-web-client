import React from 'react'
import Icon from 'grape-web/lib/svg-icons/Icon'
import IconButton from 'material-ui/IconButton'
import ThemeProvider from 'material-ui/styles/MuiThemeProvider'
import {create as createMuiTheme} from 'grape-web/lib/mui-theme'
import cn from 'classnames'

export const muiTheme = createMuiTheme({
  overrides: {
    IconButton: {
      iconButton: {
        width: 'auto',
        height: 'auto'
      }
    }
  }
})

const Button = ({classes, icon, onClick, className}) => (
  <ThemeProvider theme={muiTheme}>
    <IconButton className={cn(classes.headerControl, className)} onClick={onClick}>
      <Icon name={icon} className={classes.headerControlIcon} />
    </IconButton>
  </ThemeProvider>
)

export default ({classes, title, description, icon, onPrev, onClose}) => (
  <header className={classes.header}>
    {onPrev &&
      <Button
        classes={classes}
        className={classes.headerControlPrev}
        icon="angleLeft"
        onClick={onPrev}
      />
    }
    <div className={classes.headerContent}>
      <h2 className={classes.headerTitle}>
        {icon && <Icon name={icon} className={classes.headerTitleIcon} />}
        {title}
      </h2>
      <p className={classes.headerDescr}>{description}</p>
    </div>
    {onClose &&
      <Button
        classes={classes}
        className={classes.headerControlClose}
        icon="close"
        onClick={onClose}
      />
    }
  </header>
)
